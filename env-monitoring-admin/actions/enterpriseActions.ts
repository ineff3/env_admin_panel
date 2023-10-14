"use server"
import { prisma } from '@/prisma/client_instance'
import { Enterprise } from '@/types';
import { revalidatePath } from 'next/cache';

export const addEnterprise = async (formData: FormData) => {
    const name = formData.get('name')
    const description = formData.get('description')
    const location = formData.get('location')

    const enterpriseExists = await prisma.enterprises.findUnique({
        where: {
            name: name as string
        }
    });
    if (enterpriseExists) {
        return { error: 'Enterprise with such name already exists' };
    }
    await prisma.enterprises.create({
        data: {
            name: name as string,
            description: description as string,
            location: location as string
        }
    })
    revalidatePath('/enterprises')
}

export const editEnterprise = async (formData: FormData, id: string) => {
    const name = formData.get('name')
    const description = formData.get('description')
    const location = formData.get('location')

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
    revalidatePath('/enterprises')
}

export const deleteEnterprise = async (id: string) => {
    const enterprise = await prisma.enterprises.delete({
        where: {
            id: parseInt(id)
        }
    })
    revalidatePath('/enterprises')
}

export const createFromXlsx = async (enterprisesArray: Enterprise[]) => {
    const enterprises = await prisma.enterprises.createMany({
        data: enterprisesArray
    })
    revalidatePath('/enterprises')
}