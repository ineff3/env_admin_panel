import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/prisma/client_instance'


export async function POST(req: NextRequest) {
    const userData = await req.json();
    const userExists = await prisma.users.findUnique({
        where: {
            email: userData.email
        }
    });

    if (userExists) {
        return new NextResponse(JSON.stringify({ exist: 'true' }))
    }
    const user = await prisma.users.create({ data: userData })
    return new NextResponse(JSON.stringify(user))
}

export async function GET() {
    const users = await prisma.users.findMany();
    return new NextResponse(JSON.stringify(users));
}
