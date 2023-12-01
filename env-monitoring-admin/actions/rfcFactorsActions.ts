"use server"
import fetch from 'node-fetch';
import https from 'https';
import { CustomServerResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { RfcFactorArraySchema, RfcFactorSchema } from '@/schemas';

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

export const getRfcFactors = async () => {
    const fetchOptions = {
        method: 'GET',
        agent,
    };

    try {
        const response = await fetch('https://localhost:7001/api/RfcData', fetchOptions);

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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                factor_Name: result.data.factor_Name,
                factor_value: result.data.factor_value,
                damaged_organs: result.data.damaged_organs
            }),
            agent
        };
        const response = await fetch('https://localhost:7001/api/RfcData', fetchOptions)

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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: result.data.id,
                factor_Name: result.data.factor_Name,
                factor_value: result.data.factor_value,
                damaged_organs: result.data.damaged_organs
            }),
            agent
        };

        const response = await fetch('https://localhost:7001/api/RfcData', fetchOptions)

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
    try {
        const fetchOptions = {
            method: 'DELETE',
            agent
        }
        const response = await fetch(`https://localhost:7001/api/RfcData/id:int?id=${id}`, fetchOptions);
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result.data),
            agent
        };

        const response = await fetch('https://localhost:7001/api/RfcData/CreateRfcFactors', fetchOptions);
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