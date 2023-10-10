import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/prisma/client_instance'


export async function POST(req: NextRequest) {
    const enterpriseData = await req.json();
    const enterprise = await prisma.enterprises.delete({
        where: {
            id: parseInt(enterpriseData.id)
        }
    })


    return new NextResponse("Edited successfuly")
}