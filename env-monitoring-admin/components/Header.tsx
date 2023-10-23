'use client';

import { SlMenu } from 'react-icons/sl'
import { AiOutlineClose } from 'react-icons/ai'
import { HeaderProps } from '@/types';

const Header = ({ nav, handleNav }: HeaderProps) => {
    return (
        <div className='flex gap-6 md:gap-3 items-center text-primary px-3 md:px-0'>
            <div onClick={handleNav} className=' md:hidden '>
                {!nav ? <SlMenu size={30} /> : <AiOutlineClose size={30} />}
            </div>
            <div className='flex justify-end md:justify-center flex-auto  text-2xl lg:text-3xl font-bold   md:border-b-2 border-primary py-2 px-5'>
                /-Env-/
            </div>
        </div>
    )
}

export default Header