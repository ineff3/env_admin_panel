import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/prisma/client_instance'


export async function POST(req: NextRequest) {
    const userData = await req.json();
    const user = await prisma.users.delete({
        where: {
            user_id: parseInt(userData.id)
        }
    })


    return new NextResponse("Edited successfuly")
}