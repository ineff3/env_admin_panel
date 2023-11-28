'use client';
import { useState, useRef, useEffect } from 'react'
import { RiArrowDownSLine } from "react-icons/ri";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

interface CustomSearchDropdownProps {
    items: string[]
    selected: string
    setSelected: (selected: string) => void
}

const CustomSearchDropdown = ({ items, selected, setSelected }: CustomSearchDropdownProps) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('')
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className=' flex flex-col w-[193px] relative' ref={dropdownRef}>
            <div
                className=' flex items-center justify-between  border-gray-300 border-2 pl-3 pr-2 py-2 rounded-[8px]'
                onClick={() => setOpen(!open)}
            >
                <div className={` text-gray-400 text-lg ${!selected && 'text-gray-400'}`}>
                    {selected ?
                        selected.length > 15 ? selected.substring(0, 12) + '...' : selected
                        : 'Select RFC'}
                </div>
                <RiArrowDownSLine size={25} className={` ${open && 'rotate-180'}`} />
            </div>
            <ul className={` bg-white w-[193px] border border-[#d3d3d3] max-h-[243px] overflow-y-auto ${!open ? 'hidden' : 'absolute top-[52px]'} z-20`}>
                <div className='  flex items-center px-3 py-2 text-base text-[#7f7f7f] gap-2 border-b'>
                    <input
                        type="text"
                        placeholder='Search'
                        className=' outline-none placeholder:text-[#7f7f7f]'
                        onChange={(e) => setInputValue(e.target.value.toLowerCase())}
                        value={inputValue}
                    />
                </div>
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`  pl-3 pr-3 py-2 text-base  ${selected.toLowerCase() === item.toLowerCase() ? 'bg-gray-500 bg-opacity-80 text-white' : 'hover:bg-gray-100'} ${item.toLowerCase().startsWith(inputValue) ? 'block' : 'hidden'}`}
                        onClick={() => {
                            if (item.toLocaleLowerCase() !== selected.toLocaleLowerCase()) {
                                setSelected(item)
                                setOpen(!open)
                                setInputValue('')
                            }
                        }}
                    >
                        {item}
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default CustomSearchDropdown;