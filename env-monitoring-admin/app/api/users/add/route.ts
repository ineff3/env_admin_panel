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
        return NextResponse.json({ error: 'User with such email already exists' }, { status: 409 });
    }
    const user = await prisma.users.create({ data: userData })
    return new NextResponse(JSON.stringify(user))
}