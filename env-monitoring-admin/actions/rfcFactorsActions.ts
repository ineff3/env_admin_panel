"use server"
import fetch from 'node-fetch';
import https from 'https';
import { CustomServerResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { RfcFactorArraySchema, RfcFactorSchema } from '@/schemas';
import { formatServerErrors, getErrorMessage } from './secondary-utils/errorHandling';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const agent = new https.Agent({
    rejectUnauthorized: false
});
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRfcFactors = async () => {
    const fetchOptions = {
        method: 'GET',
        agent,
    };

    try {
        const response = await fetch(new URL('api/RfcData', API_URL), fetchOptions);

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

export const addRfcFactor = async (newRfcFactor: unknown) => {
    const session = await getServerSession(authOptions)
    try {
        //server-side validation
        const result = RfcFactorSchema.safeParse(newRfcFactor);
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
                'Content-Type': 'application/json',
                'Authorization': `bearer ${session?.user.token}`
            },
            body: JSON.stringify({
                factor_Name: result.data.factor_Name,
                factor_value: result.data.factor_value,
                damaged_organs: result.data.damaged_organs
            }),
            agent
        };
        const response = await fetch(new URL('api/RfcData', API_URL), fetchOptions)

        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/rfc-factors')
}

export const editRfcFactor = async (editedRfcFactor: unknown) => {
    const session = await getServerSession(authOptions)
    try {
        //server-side validation
        const result = RfcFactorSchema.safeParse(editedRfcFactor);
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
                'Content-Type': 'application/json',
                'Authorization': `bearer ${session?.user.token}`
            },
            body: JSON.stringify({
                id: result.data.id,
                factor_Name: result.data.factor_Name,
                factor_value: result.data.factor_value,
                damaged_organs: result.data.damaged_organs
            }),
            agent
        };

        const response = await fetch(new URL('api/RfcData', API_URL), fetchOptions)

        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/rfc-factors')

}

export const deleteRfcFactor = async (id: number) => {
    const session = await getServerSession(authOptions)
    try {
        const fetchOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${session?.user.token}`
            },
            agent
        }
        const response = await fetch(new URL(`api/RfcData/id:int?id=${id}`, API_URL), fetchOptions);
        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/rfc-factors')
}

export const createRfcFactorsFromXlsx = async (rfcFactorArray: unknown) => {
    const session = await getServerSession(authOptions)
    try {
        // server-side validation
        const result = RfcFactorArraySchema.safeParse(rfcFactorArray)
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
                'Content-Type': 'application/json',
                'Authorization': `bearer ${session?.user.token}`
            },
            body: JSON.stringify(result.data),
            agent
        };

        const response = await fetch(new URL('api/RfcData/CreateRfcFactors', API_URL), fetchOptions);
        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/rfc-factors')
}