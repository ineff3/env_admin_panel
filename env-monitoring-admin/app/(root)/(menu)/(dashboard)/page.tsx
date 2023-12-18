'use client'
import { useSearchParams } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function HomePage() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const { data: session } = useSession();

    return (
        <div className=' flex flex-col gap-3'>
            <div className=' flex'>
                Hello '<span className=' text-primary underline'>{session?.user.userName}</span>'! Welcome to the admin panel!

            </div>
            <button
                onClick={() => signOut()}

                className=" w-fit  px-6 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
            >
                <div className='flex gap-1 justify-center items-center'>
                    <p className=' hidden md:flex'>Sign Out</p>
                </div>
            </button>
            {/* {!session?.user ? (
                <button className=' max-w-[100px] border-4 border-black ' onClick={() => signIn()}>SignIN</button>
            ) : (
                <button className=' max-w-[100px] border-4 border-black ' onClick={() => signOut()}>SignOut</button>
            )}
            Welcome to the Los Pollos ({session?.user.userName}) : {session?.user.role.toString()} */}
        </div>
    );
}

