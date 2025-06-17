import AppLayout from '@/layouts/app-layout';
import { Purchase, type BreadcrumbItem } from '@/types';
import { formatPrice } from '@/utils';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchases',
        href: '/purchases',
    },
];

export default function Index({ purchases }: { purchases: Purchase[] }) {
    const [search, setSearch] = useState('');
    console.log(purchases);
    const filteredUsers = purchases.filter((purchase) => purchase.supplier.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Purchase" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Data Purchase</h2>
                    <Link href="/purchases/create" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        + Tambah Purchase
                    </Link>
                </div>

                <input
                    type="text"
                    placeholder="Cari nama supplier..."
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Supplier</th>
                                <th className="px-4 py-3">Total Belanja</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                        Tidak ada customer ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((purchase, i) => (
                                    <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                                        <td className="px-4 py-3 text-sm">{i + 1}</td>
                                        <td className="px-4 py-3 text-sm">{purchase.user.name}</td>
                                        <td className="px-4 py-3 text-sm">{purchase.supplier.name}</td>
                                        <td className="px-4 py-3 text-sm">{formatPrice(purchase.total_price)}</td>
                                        <td className="space-x-2 px-4 py-3 text-right text-sm">
                                            <Link
                                                href={`/purchases/${purchase.id}`}
                                                className="rounded px-2 py-1 text-xs text-blue-600 hover:underline"
                                            >
                                                Lihat
                                            </Link>
                                            <Link
                                                href={`/purchases/${purchase.id}/edit`}
                                                className="rounded px-2 py-1 text-xs text-yellow-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Yakin hapus ${purchase.id}?`)) {
                                                        // TODO: handle delete with Inertia.post(...)
                                                    }
                                                }}
                                                className="rounded px-2 py-1 text-xs text-red-600 hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
