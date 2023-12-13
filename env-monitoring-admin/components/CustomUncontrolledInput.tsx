'use client';
import { useState } from 'react';

export interface Props {
    title: string;
    color: string;
    name: string;
    type?: string
    required?: boolean;
}

const CustomUncontrolledInput = ({ title = "CustomUncontrolledInput", type, color, name, required = false }: Props) => {
    const [inputData, setInputData] = useState('');

    const labelClassName = inputData ? 'text-primary px-1 -translate-x-3.5 -translate-y-[22px] scale-90 transition-all duration-250 ease-in-out' : '';

    return (
        <div
            className={`flex flex-auto py-2 pl-5 pr-2 rounded-md border-gray-400 border-2 focus-within:border-${color} hover:focus-within:border-${color} relative group z-10`}
        >
            <input
                type={type || 'text'}
                name={name}
                required={required}
                className={`w-full text-lg focus:outline-none text-${color} focus:text-${color} z-50 bg-transparent myInput`}
                onChange={(e) => {
                    setInputData(e.target.value);
                }}
                value={inputData}
            />
            <div className={`absolute text-gray-400 text-lg block bg-white myInputLabel ${labelClassName}`}>{title}</div>
        </div>
    )
}

export default CustomUncontrolledInput;