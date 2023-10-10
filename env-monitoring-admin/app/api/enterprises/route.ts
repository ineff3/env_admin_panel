import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/client_instance'


export async function GET() {
    const enterprises = await prisma.enterprises.findMany();
    return new NextResponse(JSON.stringify(enterprises));
}
