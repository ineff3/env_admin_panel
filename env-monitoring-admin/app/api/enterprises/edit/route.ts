import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/prisma/client_instance'


export async function POST(req: NextRequest) {
    const enterpriseData = await req.json();
    const enterprise = await prisma.enterprises.update({
        where: {
            id: parseInt(enterpriseData.id)
        },
        data: {
            name: enterpriseData.name,
            location: enterpriseData.location,
            description: enterpriseData.description
        }
    })


    return new NextResponse("Edited successfuly")
}