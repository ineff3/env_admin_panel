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