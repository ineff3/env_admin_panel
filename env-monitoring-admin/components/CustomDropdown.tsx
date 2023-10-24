import { CustomDropdownProps } from "@/types"
import { RiArrowDropDownLine } from 'react-icons/ri'


const CustomDropdown = ({ color, name, value, handleChange, options }: CustomDropdownProps) => {
    return (
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={handleChange}
                className={`appearance-none w-full border-2 border-gray-300 text-gray-400 text-lg py-3 px-4 rounded-md leading-tight focus:outline-none `}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.name}>
                        {option.name}
                    </option>
                ))}
            </select>
            <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400`}>
                <RiArrowDropDownLine size={30} />
            </div>
        </div>
    )
}

export default CustomDropdown