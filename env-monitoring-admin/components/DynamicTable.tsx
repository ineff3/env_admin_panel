'use client';
import { DynamicTableProps } from "@/types";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, getKeyValue } from "@nextui-org/react";


const DynamicTable = ({ users, columns, isLoading, selectedRow, setSelectedRow }: DynamicTableProps) => {
    return (

        <Table
            className="font-sans"
            classNames={isLoading ? { table: "min-h-[300px]" } : {}}
            aria-label="Dynamic table"
            selectionMode="single"
            selectedKeys={selectedRow}
            onSelectionChange={setSelectedRow}
        >
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.name}</TableColumn>}
            </TableHeader>
            <TableBody
                isLoading={isLoading}
                loadingContent={<Spinner label="Loading..." />}
                emptyContent={isLoading ? '' : "No rows to display."}
                items={users}
            >
                {(item) => (
                    <TableRow key={item.user_id}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default DynamicTable

// {(columnKey) => <TableCell>{Object.values(item)[columnKey.slice(2)]}</TableCell>}
// {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}