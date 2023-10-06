'use client';
import React from 'react'
import { CustomInputProps } from '@/types';

const CustomInput = ({ title = "CustomInput", handleChange, color, value }: CustomInputProps) => {
    return (
        <div id='input-container'
            className={`flex py-2 pl-5 pr-2 rounded-md border-gray-300 border-2 focus-within:border-${color} hover:focus-within:border-${color} relative group`}>
            <input
                type='text'
                required
                className={`w-full text-lg focus:outline-none text-${color} focus:text-${color} z-50 bg-transparent myInput`}
                onChange={handleChange}
                value={value || ''}
            >
            </input>
            <div className={`absolute text-gray-400  text-mg block bg-white myInputLabel`}>{title}</div>
        </div>
    )
}

export default CustomInput;