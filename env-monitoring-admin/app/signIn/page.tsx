'use client'

import { useState } from "react";
import { signIn, signOut, useSession } from 'next-auth/react'
import { getErrorMessage } from "@/actions/secondary-utils/errorHandling";
import { CustomUncontrolledInput } from "@/components";
import { redirect } from "next/navigation";

const SignInPage = () => {
    const [errorIsOpen, setErrorIsOpen] = useState(false);
    const [errorState, setErrorState] = useState('')

    const onSignIn = async (formData: FormData) => {
        try {
            const res = await signIn('credentials',
                {
                    username: formData.get('username'),
                    password: formData.get('password'),
                    redirect: false,
                }
            )
            if (res?.error) {
                throw new Error(res?.error)
            }

        } catch (error) {
            setErrorIsOpen(true);
            setErrorState(getErrorMessage(error))
            return;
        }
        redirect('/')
    }

    return (
        <div className=' bg-secondary h-screen w-screen flex items-center justify-center px-5'>
            <div className=' max-w-[525px] h-[400px] w-full bg-white border-[2px] border-primary rounded-2xl px-4 py-8 sm:px-8'>
                <form action={onSignIn} className=' h-full flex flex-col'>
                    <div className=' text-center text-3xl font-bold text-primary '>LOG IN</div>
                    <div className=' flex flex-col mt-10 gap-5'>
                        <CustomUncontrolledInput
                            title='Username'
                            name='username'
                            color='primary'
                            required
                        />
                        <CustomUncontrolledInput
                            title='Password'
                            name='password'
                            color='primary'
                            type='password'
                            required
                        />

                    </div>
                    {errorIsOpen && (<>
                        <div className=' mt-1 text-[12px] text-red-500'>{errorState}</div>
                    </>)}
                    <div className=' flex flex-col flex-auto justify-end gap-1  mt-7'>
                        <div className=' mx-auto'>
                            <button
                                className={` border-[2px] border-primary px-10 py-2 text-xl rounded-[10px] hover:bg-slate-200 tracking-wider text-primary `}
                                type='submit'
                            >
                                Sign In
                            </button>

                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignInPage

