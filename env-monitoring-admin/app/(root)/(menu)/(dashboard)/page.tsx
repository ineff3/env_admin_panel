'use client'
import { useSearchParams } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function HomePage() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const { data: session } = useSession();

    return (
        <>
            {!session?.user ? (
                <button className=' max-w-[100px] border-4 border-black ' onClick={() => signIn()}>SignIN</button>
            ) : (
                <button className=' max-w-[100px] border-4 border-black ' onClick={() => signOut()}>SignOut</button>
            )}


            Welcome to the Los Pollos ({session?.user.userName}) : {session?.user.role.toString()}
        </>
    );
}

