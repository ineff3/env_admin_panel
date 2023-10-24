'use client';
import { DynamicTableProps } from "@/types";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, getKeyValue, Pagination } from "@nextui-org/react";
import { useState, useMemo } from "react";


const DynamicTable = ({ rowsLength, tableItems, tableColumns, isLoading, selectedRow, setSelectedRow }: DynamicTableProps) => {
    const [page, setPage] = useState(1);
    const rowsPerPage = rowsLength;

    const pages = Math.ceil(tableItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return tableItems.slice(start, end);
    }, [page, tableItems]);

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
            <TableHeader columns={tableColumns}>
                {(column) => <TableColumn key={column.key}>{column.name}</TableColumn>}
            </TableHeader>
            <TableBody
                isLoading={isLoading}
                loadingContent={<Spinner label="Loading..." />}
                emptyContent={isLoading ? '' : "No rows to display."}
                items={items}
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