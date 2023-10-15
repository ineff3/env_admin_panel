"use server"
import { prisma } from '@/prisma/client_instance'
import { Enterprise } from '@/types';
import { revalidatePath } from 'next/cache';

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

export const addEnterprise = async (formData: FormData) => {
    const name = formData.get('name')
    const description = formData.get('description')
    const location = formData.get('location')
    try {
        const enterpriseExists = await prisma.enterprises.findUnique({
            where: {
                name: name as string
            }
        });
        if (enterpriseExists) {
            throw new Error('Enterprise with such name already exists');
        }
        await prisma.enterprises.create({
            data: {
                name: name as string,
                description: description as string,
                location: location as string
            }
        })
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/enterprises')
}

export const editEnterprise = async (formData: FormData, id: string) => {
    const name = formData.get('name')
    const description = formData.get('description')
    const location = formData.get('location')

    try {
        const enterprise = await prisma.enterprises.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: name as string,
                description: description as string,
                location: location as string
            }
        })
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/enterprises')
}

export const deleteEnterprise = async (id: string) => {
    try {
        const enterprise = await prisma.enterprises.delete({
            where: {
                id: parseInt(id)
            }
        })
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/enterprises')
}

export const createFromXlsx = async (enterprisesArray: Enterprise[]) => {
    try {
        const enterprises = await prisma.enterprises.createMany({
            data: enterprisesArray
        })
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/enterprises')
}