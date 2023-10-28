'use client';
import { AdvancedDynamicTableProps } from "@/types";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination } from "@nextui-org/react";
import { useState, useMemo, useCallback } from "react";
import { RxCross2 } from 'react-icons/rx'


const AdvancedDynamicTable = ({ rowsLength, tableItems, tableColumns, isLoading, selectedRow, setSelectedRow, deleteItem }: AdvancedDynamicTableProps) => {
    const [page, setPage] = useState(1);
    const [columns, setColumns] = useState([
        ...tableColumns,
        {
            name: '',
            key: 'actions'
        }
    ])

    //Pagination logic
    const rowsPerPage = rowsLength;
    const pages = Math.ceil(tableItems.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return tableItems.slice(start, end);
    }, [page, tableItems]);

    // cells rendering
    const renderCell = useCallback((company: any, columnKey: React.Key, itemId: number) => {
        const cellValue = company[columnKey as keyof any];

        switch (columnKey) {
            case "actions":
                return (
                    <div className='flex justify-center items-center'>
                        <button
                            onClick={() => deleteItem(itemId)}
                            className="  px-2 py-2 text-gray-500 bg-white rounded-full active:bg-gray-200 hover:scale-110 hover:transition-transform hover:duration-150"
                        >
                            <RxCross2 size={25} />
                        </button>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <Table
            classNames={isLoading ? { table: "min-h-[300px]" } : {
                table: ["font-sans"],
                th: ["text-md", "font-semibold"],
                td: ["text-md"]
            }}
            aria-label="Dynamic table"
            selectionMode="single"
            selectedKeys={selectedRow}
            onSelectionChange={setSelectedRow}
            bottomContent={isLoading || tableItems.length === 0 ? <></> :
                <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                </div>

            }
        >
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.name}</TableColumn>}
            </TableHeader>
            <TableBody
                isLoading={isLoading}
                loadingContent={<Spinner label="Loading..." />}
                emptyContent={isLoading ? '' : "No rows to display."}
                items={items}
            >
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey, item.id)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default AdvancedDynamicTable

// {(columnKey) => <TableCell>{Object.values(item)[columnKey.slice(2)]}</TableCell>}
// {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}