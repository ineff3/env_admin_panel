import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/client_instance'


export async function POST(req) {
    const usersData = await req.json();
    const users = await prisma.users.createMany({
        data: usersData
    })


    return new NextResponse("Edited successfuly")
}