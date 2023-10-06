import { ChangeEventHandler } from "react";

export interface CustomInputProps {
    title: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    color: string;
    value: string;
}