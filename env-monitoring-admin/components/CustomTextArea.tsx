import React from 'react';
import { CustomTextAreaProps } from '@/types';

const CustomTextArea = ({ title = "CustomTextArea", handleChange, color, name, value }: CustomTextAreaProps) => {
    return (
        <div id='textarea-container'
            className={`flex flex-auto py-2 pl-5 pr-2 rounded-md border-gray-300 border-2 focus-within:border-${color} hover:focus-within:border-${color} relative group`}
        >
            <textarea
                required
                name={name}
                className={` resize-none w-full h-40 text-lg focus:outline-none text-${color} focus:text-${color} z-50 bg-transparent myInput`}
                onChange={handleChange}
                value={value || ''}
            />
            <div className={`absolute text-gray-400 text-lg block bg-white myInputLabel`}>{title}</div>
        </div>
    );
}

export default CustomTextArea;
