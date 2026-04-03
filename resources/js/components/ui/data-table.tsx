import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PackageOpen } from 'lucide-react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    emptyTitle?: string;
    emptyDescription?: string;
    action?: React.ReactNode;
    pagination?: {
        total: number;
        label?: string;
    };
}

export function DataTable<TData, TValue>({
    columns,
    data,
    emptyTitle = 'No data found',
    emptyDescription = "We couldn't find anything matching your criteria.",
    action,
    pagination,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/40 text-muted-foreground">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="uppercase tracking-wider text-xs font-semibold p-4"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef
                                                              .header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="divide-y divide-border/50">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="p-4">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-48 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                                            <PackageOpen className="mb-4 h-12 w-12 opacity-20" />
                                            <p className="text-lg font-medium text-foreground">
                                                {emptyTitle}
                                            </p>
                                            <p className="text-sm">
                                                {emptyDescription}
                                            </p>
                                            {action && <div className="mt-4">{action}</div>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Info */}
                {data.length > 0 && pagination && (
                    <div className="border-t border-border/50 bg-muted/20 p-4 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{data.length}</span>{' '}
                            {pagination.total > data.length ? `of ${pagination.total}` : ''} {pagination.label || 'items'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
