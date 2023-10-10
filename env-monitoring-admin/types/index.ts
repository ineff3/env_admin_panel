import { ChangeEventHandler } from "react";
import { Selection } from "@nextui-org/react";

export interface CustomInputProps {
    title: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    color: string;
    value?: string;
}
export interface CustomTextAreaProps {
    title: string;
    handleChange: ChangeEventHandler<HTMLTextAreaElement>;
    color: string;
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
    email?: string;
    password?: string;
}
export interface User extends UserData {
    user_id: number;
}
export interface EnterpriseData {
    name: string
    description: string
    location: string
}
export interface Enterpsise extends EnterpriseData {
    id: number;
}

export interface TableColumns {
    name: string;
    key: string;
}
export interface DynamicTableProps {
    styles: {}
    tableItems: any[];
    tableColumns: TableColumns[];
    isLoading: boolean;
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