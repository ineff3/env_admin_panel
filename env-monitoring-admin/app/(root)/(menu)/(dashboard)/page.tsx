import { prisma } from '@/prisma/client_instance'
import Dashboard from './Dashboard';
import { User } from '@/types';


export default async function HomePage() {
    const usersArray = await prisma.users.findMany();

    return (
        <>
            <div>
                <Dashboard users={usersArray as User[]} />
            </div>
        </>
    );
}

