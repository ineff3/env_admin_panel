import { ChangeEventHandler } from "react";
import { Selection } from "@nextui-org/react";

export interface CustomInputProps {
    title: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
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

export interface TableColumns {
    name: string;
    key: string;
}
export interface DynamicTableProps {
    tableItems: User[];
    tableColumns: TableColumns[];
    isLoading: boolean;
    selectedRow: Selection
    setSelectedRow: (selectedRow: Selection) => void;
}