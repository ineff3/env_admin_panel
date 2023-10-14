"use server"
import { prisma } from '@/prisma/client_instance'
import { User } from '@/types';
import { revalidatePath } from 'next/cache';

export const addUser = async (formData: FormData) => {
    const email = formData.get('email');
    const password = formData.get('password');

    const userExists = await prisma.users.findUnique({
        where: {
            email: email as string
        }
    });
    if (userExists) {
        return { error: 'User with such email already exists' };
    }
    await prisma.users.create({
        data: {
            email: email as string,
            password: password as string
        }
    })
    revalidatePath('/')
}

export const editUser = async (formData: FormData, id: string) => {
    const email = formData.get('email');
    const password = formData.get('password');

    const user = await prisma.users.update({
        where: {
            user_id: parseInt(id)
        },
        data: {
            email: email as string,
            password: password as string
        }
    })
    revalidatePath('/')
}

export const deleteUser = async (id: string) => {
    const user = await prisma.users.delete({
        where: {
            user_id: parseInt(id)
        }
    })
    revalidatePath('/')
}
export const createFromXlsx = async (usersArray: User[]) => {
    const users = await prisma.users.createMany({
        data: usersArray
    })
    revalidatePath('/')
}
