"use server"
import fetch from 'node-fetch';
import https from 'https';
import { CustomServerResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { PollutionArraySchema, PollutionSchema } from '@/schemas';
import { formatServerErrors, getErrorMessage } from './secondary-utils/errorHandling';

const agent = new https.Agent({
    rejectUnauthorized: false
});
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPollutions = async () => {
    const fetchOptions = {
        method: 'GET',
        agent,
    };

    try {
        const response = await fetch(new URL('api/EnvData', API_URL), fetchOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json() as CustomServerResponse;

        return data.result;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

export const addPollution = async (newPollution: unknown) => {
    try {
        //server-side validation
        const result = PollutionSchema.safeParse(newPollution);
        if (!result.success) {
            let errorMessage = '';
            result.error.issues.forEach((err) => {
                errorMessage += err.path[0] + ': ' + err.message + '. '
            })
            throw new Error(errorMessage);
        }

        const fetchOptions = {
            method: 'POST',
            headers: {
                'accept': 'text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                factor_Name: result.data.factor_Name,
                factor_value: result.data.factor_value,
                passport_id: result.data.passport_id,
                factor_Ca_value: result.data.factor_Ca_value,
                factor_Ch_value: result.data.factor_Ch_value,
                rfc_factor_id: result.data.rfc_factor_id
            }),
            agent
        };
        const response = await fetch(new URL('api/EnvData/CreateEnvFactor', API_URL), fetchOptions)

        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/pollutions')
}

export const editPollution = async (editedPollution: unknown) => {
    try {
        //server-side validation
        const result = PollutionSchema.safeParse(editedPollution);
        if (!result.success) {
            let errorMessage = '';
            result.error.issues.forEach((err) => {
                errorMessage += err.path[0] + ': ' + err.message + '. '
            })
            throw new Error(errorMessage);
        }

        const fetchOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: result.data.id,
                factor_Name: result.data.factor_Name,
                factor_value: result.data.factor_value,
                passport_id: result.data.passport_id,
                factor_Ca_value: result.data.factor_Ca_value,
                factor_Ch_value: result.data.factor_Ch_value,
                rfc_factor_id: result.data.rfc_factor_id
            }),
            agent
        };

        const response = await fetch(new URL('api/EnvData', API_URL), fetchOptions)

        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/pollutions')

}

export const deletePollution = async (id: number) => {
    try {
        const fetchOptions = {
            method: 'DELETE',
            agent
        }
        const response = await fetch(new URL(`api/EnvData/id:int?id=${id}`, API_URL), fetchOptions);
        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/pollutions')
}


export const createPollutionFromXlsx = async (pollutionArray: unknown) => {
    try {
        // server-side validation
        const result = PollutionArraySchema.safeParse(pollutionArray)
        if (!result.success) {
            let errorMessage = '';
            result.error.issues.forEach((err) => {
                errorMessage += err.path[0] + ': ' + err.message + '. '
            })
            throw new Error(errorMessage);
        }
        const fetchOptions = {
            method: 'POST',
            headers: {
                'accept': 'text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result.data),
            agent
        };

        const response = await fetch(new URL('api/EnvData/CreateEnvFactors', API_URL), fetchOptions);
        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/pollutions')
}