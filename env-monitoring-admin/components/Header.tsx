'use client';

import { SlMenu } from 'react-icons/sl'
import { AiOutlineClose } from 'react-icons/ai'
import { HeaderProps } from '@/types';

const Header = ({ nav, handleNav }: HeaderProps) => {
    return (
        <div className='flex gap-3 items-center text-primary px-3 md:px-0'>
            <div onClick={handleNav} className=' md:hidden '>
                {!nav ? <SlMenu size={30} /> : <AiOutlineClose size={30} />}
            </div>
            <div className=' mx-auto text-2xl md:text-3xl font-bold   border-b-2 border-primary py-2 px-5'>
                /-Env-/
            </div>
        </div>
    )
}

export default Header