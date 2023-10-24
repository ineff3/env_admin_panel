"use server"
import fetch from 'node-fetch';
import https from 'https';
import { CustomServerResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { PassportSchema } from '@/schemas';

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

export const getPassports = async () => {
    const fetchOptions = {
        method: 'GET',
        agent,
    };

    try {
        const response = await fetch('https://localhost:7001/api/PassportData', fetchOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json() as CustomServerResponse;

        return data.result;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export const addPassport = async (newPassport: unknown) => {
    try {
        //server-side validation
        const result = PassportSchema.safeParse(newPassport);
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
                company_id: result.data.company_id,
                year: result.data.year,
            }),
            agent
        };
        const response = await fetch('https://localhost:7001/api/PassportData', fetchOptions)

        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/passports')
}

export const editPassport = async (editedPassport: unknown) => {
    try {
        //server-side validation
        const result = PassportSchema.safeParse(editedPassport);
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
                company_id: result.data.company_id,
                year: result.data.year,
                id: result.data.id
            }),
            agent
        };

        const response = await fetch('https://localhost:7001/api/PassportData', fetchOptions)

        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/passports')

}

export const deletePassport = async (id: string) => {
    try {
        const fetchOptions = {
            method: 'DELETE',
            agent
        }
        const response = await fetch(`https://localhost:7001/api/PassportData/id:int?id=${parseInt(id)}`, fetchOptions);
        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/passports')
}