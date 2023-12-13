"use server"
import fetch from 'node-fetch';
import https from 'https';
import { CustomServerResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { PassportSchema } from '@/schemas';
import { formatServerErrors, getErrorMessage } from './secondary-utils/errorHandling';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const agent = new https.Agent({
    rejectUnauthorized: false
});
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPassports = async () => {
    const fetchOptions = {
        method: 'GET',
        agent,
    };

    try {
        const response = await fetch(new URL('api/PassportData', API_URL), fetchOptions);

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
    const session = await getServerSession(authOptions)
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
                'Content-Type': 'application/json',
                'Authorization': `bearer ${session?.user.token}`
            },
            body: JSON.stringify({
                company_id: result.data.company_id,
                year: result.data.year,
            }),
            agent
        };
        const response = await fetch(new URL('api/PassportData', API_URL), fetchOptions)

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
    const session = await getServerSession(authOptions)
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
                'Content-Type': 'application/json',
                'Authorization': `bearer ${session?.user.token}`
            },
            body: JSON.stringify({
                company_id: result.data.company_id,
                year: result.data.year,
                id: result.data.id
            }),
            agent
        };

        const response = await fetch(new URL('api/PassportData', API_URL), fetchOptions)

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

export const deletePassport = async (id: number) => {
    const session = await getServerSession(authOptions)
    try {
        const fetchOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${session?.user.token}`
            },
            agent
        }
        const response = await fetch(new URL(`api/PassportData/id:int?id=${id}`, API_URL), fetchOptions);
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