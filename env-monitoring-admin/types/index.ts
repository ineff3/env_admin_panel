import { ChangeEventHandler } from "react";
import { Selection } from "@nextui-org/react";
import { IconType } from "react-icons/lib";

export interface CustomInputProps {
    title: string;
    color: string;
    name: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    value?: string;
    required?: boolean;
    disabled?: boolean
}
export interface CustomTextAreaProps {
    title: string;
    color: string;
    name: string;
    handleChange: ChangeEventHandler<HTMLTextAreaElement>;
    value?: string;
    required?: boolean;
}
export interface CustomDropdownProps {
    color: string,
    name: string,
    handleChange: ChangeEventHandler<HTMLSelectElement>
    value?: string,
    options: CompanyNamesArrayType
}

export interface HeaderProps {
    nav: boolean;
    handleNav: () => void
}

export interface NavbarProps {
    handleNav: () => void
}

export interface TableColumns {
    name: string;
    key: string;
}

export interface DynamicTableProps {
    rowsLength: number
    tableItems: any[];
    tableColumns: TableColumns[];
    isLoading?: boolean;
    selectedRow: Selection
    setSelectedRow: (selectedRow: Selection) => void;
    deleteItem: (id: number) => void;
    withSearchBar?: boolean
    filterFunction?: (items: any, filterValue: string) => typeof items
}

export interface CustomBtnProps {
    title: string
    icon: React.ReactNode
    formActionFunction: (formData: FormData) => void
}

// -------------------------------------------------------------------
export interface CustomServerResponse {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: string[];
    result: any[];
}
export interface CompanyDataType {
    name: string;
    description: string;
    city_id?: string
}
export interface CompanyType extends CompanyDataType {
    id: number;
}
export type CompanyNamesArrayType = Array<{ name: string }>

export interface PassportDataType {
    company_id: string,
    year: string
    source_operating_time: string
}

export interface PassportType extends PassportDataType {
    id: number
}

export interface PollutionDataType {
    name: string,
    value: string,
    passport_id: string
    cA_value: string
    cH_value: string
    pollutant_id: string
}

export interface PollutionType extends PollutionDataType {
    id: number
}

export interface rfcFactorDataType {
    name: string,
    damaged_organs?: string
    rfC_value: string,
    sF_value: string,
    gdK_value: string,
    mass_flow_rate: string

}

export interface rfcFactorType extends rfcFactorDataType {
    id: number
}

export interface UserDataType {
    userName: string
    email: string
    role: string
}

export interface UserType extends UserDataType {
    id: string
}

export interface CityType {
    id: number
    name: string
    population: number
    isResort: boolean
    region_id: number
}