import React, { useEffect } from 'react';
import { CustomTextAreaProps } from '@/types';
import { useState } from 'react';

const CustomTextArea = ({ title = "CustomTextArea", handleChange, color, name, value, required = false }: CustomTextAreaProps) => {
    const [textareaData, setTextareaData] = useState('');
    useEffect(() => {
        setTextareaData(value || '');

    }, [value]);

    const labelClassName = textareaData ? 'text-primary px-1 -translate-x-3.5 -translate-y-[22px] scale-90 transition-all duration-250 ease-in-out' : '';

    return (
        <div id='textarea-container'
            className={`flex flex-auto py-2 pl-5 pr-2 rounded-md border-gray-300 border-2 focus-within:border-${color} hover:focus-within:border-${color} relative group`}
        >
            <textarea
                required={required}
                name={name}
                className={` resize-none w-full h-40 text-lg focus:outline-none text-${color} focus:text-${color} z-20 bg-transparent myInput`}
                onChange={(e) => {
                    setTextareaData(e.target.value);
                    handleChange(e);
                }}
                value={textareaData}
            />
            <div className={`absolute text-gray-400 text-lg block bg-white myInputLabel ${labelClassName}`}>{title}</div>
        </div>
    );
}

export default CustomTextArea;
