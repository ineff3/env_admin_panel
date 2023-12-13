"use server"
import fetch from 'node-fetch';
import https from 'https';
import { CustomServerResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { CompanySchema } from '@/schemas';
import { formatServerErrors, getErrorMessage } from './secondary-utils/errorHandling';

const agent = new https.Agent({
    rejectUnauthorized: false
});

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCompanies = async () => {
    const fetchOptions = {
        method: 'GET',
        agent,
    };

    try {
        const response = await fetch(new URL('api/CompanyData', API_URL), fetchOptions);

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

export const addCompany = async (newCompany: unknown) => {
    try {
        //server-side validation
        const result = CompanySchema.safeParse(newCompany);
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
                name: result.data.name,
                description: result.data.description,
                location: result.data.location
            }),
            agent
        };
        const response = await fetch(new URL('api/CompanyData', API_URL), fetchOptions)

        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/companies')
}

export const editCompany = async (editedCompany: unknown) => {
    try {
        //server-side validation
        const result = CompanySchema.safeParse(editedCompany);
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
                name: result.data.name,
                description: result.data.description,
                location: result.data.location
            }),
            agent
        };

        const response = await fetch(new URL('api/CompanyData', API_URL), fetchOptions)

        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/enterprises')

}

export const deleteCompany = async (id: number) => {
    try {
        const fetchOptions = {
            method: 'DELETE',
            agent
        }
        const response = await fetch(new URL(`api/CompanyData/id:int?id=${id}`, API_URL), fetchOptions);
        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/companies')
}
