'use client';

import { CustomBtnProps } from "@/types";

const CustomBtn = ({ title, icon, formActionFunction }: CustomBtnProps) => {
    return (
        <button
            formAction={formActionFunction}

            className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
        >
            <div className='flex gap-1 justify-center items-center'>
                <p className=' hidden md:flex'>{title}</p>
                {icon}
            </div>
        </button>
    )
}

export default CustomBtn