"use server"
import fetch from 'node-fetch';
import https from 'https';
import { CustomServerResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { CompanySchema } from '@/schemas';

const agent = new https.Agent({
    rejectUnauthorized: false
});

export const getCompanies = async () => {
    const fetchOptions = {
        method: 'GET',
        agent,
    };

    try {
        const response = await fetch('https://localhost:7001/api/CompanyData', fetchOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json() as CustomServerResponse;

        return data.result;
    } catch (error) {
        console.error('Ошибка:', error);
        return [];
    }
};

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
        //checking if element already exists
        // const enterpriseExists = await prisma.enterprises.findUnique({
        //     where: {
        //         name: result.data.name
        //     }
        // });
        // if (enterpriseExists) {
        //     throw new Error('Enterprise with such name already exists');
        // }
        //adding new element
        const fetchOptions = {
            method: 'POST',
            headers: {
                'accept': 'text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: result.data.name,
                description: result.data.description,
            }),
            agent
        };
        const response = await fetch('https://localhost:7001/api/CompanyData', fetchOptions)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
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
            }),
            agent
        };

        const response = await fetch('https://localhost:7001/api/CompanyData', fetchOptions)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/enterprises')

}

export const deleteCompany = async (id: string) => {
    try {
        const fetchOptions = {
            method: 'DELETE',
            agent
        }
        const response = await fetch(`https://localhost:7001/api/CompanyData/id:int?id=${parseInt(id)}`, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/companies')
}