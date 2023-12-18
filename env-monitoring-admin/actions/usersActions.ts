"use server"
import fetch from 'node-fetch';
import https from 'https';
import { CustomServerResponse } from '@/types';
import { formatServerErrors, getErrorMessage } from './secondary-utils/errorHandling';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from 'next/cache';

const agent = new https.Agent({
    rejectUnauthorized: false
});
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUsers = async () => {
    const session = await getServerSession(authOptions)
    const fetchOptions = {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.user.token}`
        },
        agent,
    };

    try {
        const response = await fetch(new URL('api/UserData/GetAllUsers', API_URL), fetchOptions);

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

export const getUserRoles = async () => {
    const session = await getServerSession(authOptions)
    const fetchOptions = {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.user.token}`
        },
        agent,
    };

    try {
        const response = await fetch(new URL('api/UserData/GetRoles', API_URL), fetchOptions);

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

export const deleteUser = async (id: string) => {
    const session = await getServerSession(authOptions)
    try {
        const fetchOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${session?.user.token}`
            },
            agent
        }
        const response = await fetch(new URL(`api/UserData/DeleteUser?userId=${id}`, API_URL), fetchOptions);
        if (!response.ok) {
            const responseBody = await response.json() as CustomServerResponse;
            throw new Error(formatServerErrors(responseBody.errorMessages));
        }
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/users')
}