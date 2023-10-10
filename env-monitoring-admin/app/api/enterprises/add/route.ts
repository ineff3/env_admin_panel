import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/prisma/client_instance'


export async function POST(req: NextRequest) {
    const enterpriseData = await req.json();
    const enterpriseExists = await prisma.enterprises.findUnique({
        where: {
            name: enterpriseData.name
        }
    });

    if (enterpriseExists) {
        return NextResponse.json({ error: 'Enterprise with such name already exists' }, { status: 409 });
    }
    const enterprise = await prisma.enterprises.create({ data: enterpriseData })
    return new NextResponse(JSON.stringify(enterprise))
}