import { ChangeEventHandler } from "react";
import { Selection } from "@nextui-org/react";

export interface CustomInputProps {
    title: string;
    color: string;
    name: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    value?: string;
}
export interface CustomTextAreaProps {
    title: string;
    color: string;
    name: string;
    handleChange: ChangeEventHandler<HTMLTextAreaElement>;
    value?: string;
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

export interface UserData {
    email: string;
    password: string;
}
export interface User extends UserData {
    user_id: number;
}
export interface EnterpriseData {
    name: string
    description: string
    location: string
}
export interface Enterprise extends EnterpriseData {
    id: number;
}

export interface TableColumns {
    name: string;
    key: string;
}
export interface DynamicTableProps {
    tableItems: any[];
    tableColumns: TableColumns[];
    isLoading?: boolean;
    selectedRow: Selection
    setSelectedRow: (selectedRow: Selection) => void;
}

export interface CustomButtonSelectionProps {
    passedData: {}
    apiRoute: string
    resetFieldsData: () => void;
    fieldsCorrect: () => boolean;
    selectedRow: Selection;
    resetRow: () => void;
    setTableData: (tableData: any[]) => void;
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
}
export interface CompanyType extends CompanyDataType {
    id: number;
}
export type CompanyNamesArrayType = Array<{ name: string }>

export interface PassportDataType {
    company_id: string,
    year: string
}

export interface PassportType extends PassportDataType {
    id: number
}