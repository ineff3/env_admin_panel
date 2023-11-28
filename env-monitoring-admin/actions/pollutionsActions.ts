"use server"
import fetch from 'node-fetch';
import https from 'https';
import { CustomServerResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { PollutionArraySchema, PollutionSchema } from '@/schemas';

const agent = new https.Agent({
    rejectUnauthorized: false
});

const getErrorMessage = (error: unknown): string => {
    let message: string;
    if (error instanceof Error) {
        message = error.message;
    }
    else if (error && typeof error === "object" && "message" in error) {
        message = String(error.message);
    }
    else if (typeof error == "string") {
        message = error;
    }
    else {
        message = "Something went wrong";
    }
    return message;
}

const formatServerErrors = (errorMessages: string[]) => {
    if (!Array.isArray(errorMessages) || errorMessages.length === 0) {
        return;
    }

    return errorMessages.join('. ');
}

export const getPollutions = async () => {
    const fetchOptions = {
        method: 'GET',
        agent,
    };

    try {
        const response = await fetch('https://localhost:7001/api/EnvData', fetchOptions);

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
        const response = await fetch('https://localhost:7001/api/EnvData/CreateEnvFactor', fetchOptions)

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

        const response = await fetch('https://localhost:7001/api/EnvData', fetchOptions)

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
        const response = await fetch(`https://localhost:7001/api/EnvData/id:int?id=${id}`, fetchOptions);
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

        const response = await fetch('https://localhost:7001/api/EnvData/CreateEnvFactors', fetchOptions);
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