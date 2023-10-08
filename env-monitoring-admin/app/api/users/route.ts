import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/client_instance'


export async function GET() {
    const users = await prisma.users.findMany();
    return new NextResponse(JSON.stringify(users));
}
