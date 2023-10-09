import { CustomButtonSelectionProps } from '@/types';
import React from 'react'
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { BsFiletypeXlsx } from 'react-icons/bs'
import * as XLSX from 'xlsx';

const CustomButtonSection = ({ passedData, apiRoute, fieldsCorrect, resetFieldsData, selectedRow, resetRow, setTableData }: CustomButtonSelectionProps) => {

    async function addElement(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!fieldsCorrect()) {
            return;
        }
        const response = await fetch(`/api/${apiRoute}/add`, {
            method: 'POST',
            body: JSON.stringify(passedData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}\nError status: ${response.status}`);
            return;
        }
        setTableData(await fetch(`api/${apiRoute}`).then(res => res.json()))
        resetFieldsData();
        resetRow();
    }

    async function editElement(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!fieldsCorrect()) {
            return;
        }
        if (typeof selectedRow === 'string' || selectedRow.size === 0) {
            alert("Row is not selected")
            return;
        }
        const rowId: string = selectedRow.values().next().value;

        const response = await fetch(`/api/${apiRoute}/edit`, {
            method: 'POST',
            body: JSON.stringify({ id: rowId, ...passedData }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            alert('Something went wrong');
            return;
        }
        setTableData(await fetch(`api/${apiRoute}`).then(res => res.json()))
        resetFieldsData();
        resetRow();
    }

    async function deleteElement(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        if (typeof selectedRow === 'string' || selectedRow.size === 0) {
            alert("Row is not selected")
            return;
        }
        const rowId: string = selectedRow.values().next().value;
        const response = await fetch(`/api/${apiRoute}/delete`, {
            method: 'POST',
            body: JSON.stringify({ id: rowId }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            alert('Something went wrong');
            return;
        }
        setTableData(await fetch(`api/${apiRoute}`).then(res => res.json()))
        resetFieldsData();
        resetRow();
    }

    async function handleXlsx(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const usersArray = await getDataFromXlsx();
        const response = await fetch(`/api/${apiRoute}/createMany`, {
            method: 'POST',
            body: JSON.stringify(usersArray),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) {
            alert('Something went wrong');
            return;
        }
        setTableData(await fetch(`api/${apiRoute}`).then(res => res.json()))
        resetFieldsData();
        resetRow();
    }

    async function getDataFromXlsx() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.xlsx';

            input.onchange = (event) => {

                const inputElement = event.target as HTMLInputElement;
                const file = inputElement.files?.[0];
                if (file) {
                    const reader = new FileReader();

                    reader.onload = async (e) => {
                        const data = e.target?.result;
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];

                        //sheet_to_json converts a worksheet object to an array of JSON objects.
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
                        const headerRow = jsonData[0];
                        const dataRows = jsonData.slice(1);

                        const dataArray = dataRows.map((row: string[]) => {
                            const obj: { [key: string]: any } = {};
                            headerRow.forEach((header: string, index: number) => {
                                obj[header] = row[index];
                            });
                            return obj;
                        });
                        console.log(dataArray);

                        resolve(dataArray);

                    };

                    reader.readAsArrayBuffer(file);
                }
            };

            input.click();
        })
    }

    return (
        <div className="flex gap-5 justify-center">
            <button
                onClick={addElement}
                type="submit"
                className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
            >
                <AiOutlinePlus color="white" size={30} />
            </button>
            <button
                onClick={editElement}
                type="submit"
                className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
            >
                <AiOutlineEdit color="white" size={30} />
            </button>
            <button
                onClick={deleteElement}
                type="submit"
                className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
            >
                <AiOutlineDelete color="white" size={30} />
            </button>
            <button
                onClick={handleXlsx}
                type="submit"
                className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
            >
                <BsFiletypeXlsx color="white" size={30} />
            </button>
        </div>
    )
}

export default CustomButtonSection