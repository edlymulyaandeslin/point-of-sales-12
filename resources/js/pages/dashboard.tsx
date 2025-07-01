import AppLayout from '@/layouts/app-layout';
import { PaginatedData, Transaction, type BreadcrumbItem } from '@/types';
import { formatPrice, formatSimpleDate, getTransactionStatusStyle } from '@/utils';
import { Head, Link } from '@inertiajs/react';
import { Coins, ShoppingBag, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard({
    new_transaction,
    total_penjualan,
    jumlah_transaksi_today,
    jumlah_barang_terjual,
}: {
    new_transaction: PaginatedData<Transaction>;
    total_penjualan: number;
    jumlah_transaksi_today: number;
    jumlah_barang_terjual: number;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard POS" />

            <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold">Ringkasan Penjualan Bulan Ini</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            icon: <Coins className="text-yellow-500" />,
                            label: 'Total Penjualan',
                            value: formatPrice(total_penjualan),
                        },
                        {
                            icon: <ShoppingBag className="text-blue-600" />,
                            label: 'Transaksi Hari Ini',
                            value: `${jumlah_transaksi_today} Transaksi`,
                        },
                        {
                            icon: <TrendingUp className="text-purple-600" />,
                            label: 'Produk Terjual',
                            value: `${jumlah_barang_terjual} Barang`,
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
                                    {new_transaction.data.map((trx, idx) => (
                                        <tr key={idx} className="border-b text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
                                            <td className="p-2">{formatSimpleDate(trx.created_at)}</td>
                                            <td className="p-2">{trx.user.name}</td>
                                            <td className="p-2">{formatPrice(trx.total_price)}</td>
                                            <td className="p-2">
                                                {(() => {
                                                    const { label, className } = getTransactionStatusStyle(trx.status);
                                                    return <span className={className}>{label}</span>;
                                                })()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex items-center justify-center">
                            <Link
                                href="/transactions"
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
