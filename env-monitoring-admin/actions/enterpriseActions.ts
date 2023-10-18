"use server"
import { prisma } from '@/prisma/client_instance'
import { EnterpriseArraySchema, EnterpriseSchema } from '@/schemas';
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

export const addEnterprise = async (newEnterprise: unknown) => {
    try {
        //server-side validation
        const result = EnterpriseSchema.safeParse(newEnterprise);
        if (!result.success) {
            let errorMessage = '';
            result.error.issues.forEach((err) => {
                errorMessage += err.path[0] + ': ' + err.message + '. '
            })
            throw new Error(errorMessage);
        }
        //checking if element already exists
        const enterpriseExists = await prisma.enterprises.findUnique({
            where: {
                name: result.data.name
            }
        });
        if (enterpriseExists) {
            throw new Error('Enterprise with such name already exists');
        }
        //adding new element
        await prisma.enterprises.create({
            data: {
                name: result.data.name,
                description: result.data.description,
                location: result.data.location
            }
        })
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/enterprises')
}

export const editEnterprise = async (editedEnterprise: unknown) => {
    try {
        //server-side validation
        const result = EnterpriseSchema.safeParse(editedEnterprise);
        if (!result.success) {
            let errorMessage = '';
            result.error.issues.forEach((err) => {
                errorMessage += err.path[0] + ': ' + err.message + '. '
            })
            throw new Error(errorMessage);
        }

        const enterprise = await prisma.enterprises.update({
            where: {
                id: result.data.id
            },
            data: {
                name: result.data.name,
                description: result.data.description,
                location: result.data.location
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

export const createFromXlsx = async (enterpriseArray: unknown) => {
    try {
        //server-side validation
        const result = EnterpriseArraySchema.safeParse(enterpriseArray)
        if (!result.success) {
            let errorMessage = '';
            result.error.issues.forEach((err) => {
                errorMessage += err.path[0] + ': ' + err.message + '. '
            })
            throw new Error(errorMessage);
        }
        const enterprises = await prisma.enterprises.createMany({
            data: result.data
        })
    }
    catch (error) {
        return { error: getErrorMessage(error) }
    }
    revalidatePath('/enterprises')
}