import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/prisma/client_instance'


export async function POST(req: NextRequest) {
    const userData = await req.json();
    const user = await prisma.users.update({
        where: {
            user_id: parseInt(userData.id)
        },
        data: {
            email: userData.email,
            password: userData.password
        }
    })


    return new NextResponse("Edited successfuly")
}