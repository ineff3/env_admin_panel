import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/prisma/client_instance'


export async function POST(req: NextRequest) {
    const enterpriseData = await req.json();
    const enterprises = await prisma.enterprises.createMany({
        data: enterpriseData
    })


    return new NextResponse("Edited successfuly")
}