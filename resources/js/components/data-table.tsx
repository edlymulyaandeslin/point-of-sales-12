import { ReactNode } from 'react';
import Pagination from './pagination';

interface Column<T> {
    title: string;
    render: (item: T, index: number) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    from?: number;
    to?: number;
    total?: number;
    links?: any[]; // Disesuaikan dengan komponen Pagination kamu
    emptyMessage?: string;
}

export default function DataTable<T>({ columns, data, from = 1, to, total, links = [], emptyMessage = 'Tidak ada data.' }: DataTableProps<T>) {
    return (
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={`px-4 py-3 ${col.className ?? ''}`}>
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={`px-4 py-3 text-sm ${col.className ?? ''}`}>
                                        {col.render(item, index + from)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Optional Pagination */}
            {(from || to || total || links.length > 0) && <Pagination from={from} to={to} total={total} links={links} />}
        </div>
    );
}
