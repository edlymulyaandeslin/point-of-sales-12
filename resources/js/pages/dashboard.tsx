import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard POS" />

            <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold">Ringkasan Penjualan</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            icon: <DollarSign className="text-green-600" />,
                            label: 'Total Penjualan',
                            value: 'Rp 15.200.000',
                        },
                        {
                            icon: <ShoppingBag className="text-blue-600" />,
                            label: 'Transaksi Hari Ini',
                            value: '128 Transaksi',
                        },
                        {
                            icon: <Users className="text-yellow-600" />,
                            label: 'Pelanggan Baru',
                            value: '32 Pelanggan',
                        },
                        {
                            icon: <TrendingUp className="text-purple-600" />,
                            label: 'Produk Terjual',
                            value: '524 Barang',
                        },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">{item.icon}</div>
                            <div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</div>
                                <div className="text-lg font-semibold">{item.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                        <h3 className="mb-4 text-lg font-semibold">Grafik Penjualan</h3>
                        <div className="h-48 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                        {/* Ganti dengan Chart.js atau Recharts */}
                    </div>

                    <div className="rounded-xl border p-4 shadow-sm lg:col-span-2 dark:border-zinc-700 dark:bg-zinc-900">
                        <h3 className="mb-4 text-lg font-semibold">Transaksi Terbaru</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b dark:border-zinc-700">
                                        <th className="p-2 text-left">Tanggal</th>
                                        <th className="p-2 text-left">Kasir</th>
                                        <th className="p-2 text-left">Total</th>
                                        <th className="p-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { tanggal: '14 Jun 2025', kasir: 'Andi', total: 'Rp 230.000', status: 'Sukses' },
                                        { tanggal: '14 Jun 2025', kasir: 'Dina', total: 'Rp 420.000', status: 'Sukses' },
                                        { tanggal: '13 Jun 2025', kasir: 'Rudi', total: 'Rp 180.000', status: 'Pending' },
                                    ].map((trx, idx) => (
                                        <tr key={idx} className="border-b text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
                                            <td className="p-2">{trx.tanggal}</td>
                                            <td className="p-2">{trx.kasir}</td>
                                            <td className="p-2">{trx.total}</td>
                                            <td className="p-2">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        trx.status === 'Sukses'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    }`}
                                                >
                                                    {trx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
