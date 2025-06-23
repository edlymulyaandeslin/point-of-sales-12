import DataTable from '@/components/data-table';
import Modal from '@/components/modal';
import PrintReceipt from '@/components/print-receipt';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Transaction } from '@/types';
import { formatPrice, getPaymentMethodStyle, getTransactionStatusStyle } from '@/utils';
import { Head, router, usePage } from '@inertiajs/react';
import { HandCoins, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/transactions',
    },
];

export default function Index({ transactions }: { transactions: PaginatedData<Transaction> }) {
    const { props } = usePage<{ transactions: PaginatedData<Transaction>; search?: string }>();
    const initialSearch = props.search || '';
    const [search, setSearch] = useState(initialSearch);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Debounce search
    useEffect(() => {
        if (search !== initialSearch) {
            const delayDebounce = setTimeout(() => {
                router.get('/transactions', { search }, { preserveState: true, replace: true });
            }, 400);

            return () => clearTimeout(delayDebounce);
        }
    }, [search, initialSearch]);

    const handleDelete = () => {
        if (!selectedTransaction) return;

        router.delete(`/transactions/${selectedTransaction.id}`, {
            onSuccess: () => {
                setOpenDeleteModal(false);
                setSelectedTransaction(null);
            },
            onError: (err) => {
                console.error('Gagal hapus transaksi:', err);
                alert('Gagal menghapus transaksi. Coba lagi.');
            },
        });
    };

    const handlePrint = (transaction: Transaction) => {
        setSelectedTransaction(transaction);

        // Tunggu render PrintReceipt selesai sebelum print
        setTimeout(() => {
            const printContent = document.getElementById('print-section');
            if (!printContent) return;

            const WinPrint = window.open('', '', 'width=720,height=1080');
            if (!WinPrint) return;

            WinPrint.document.write(`
            <html>
                <head>
                    <title>Struk Transaksi</title>
                    <style>
                        body {
                            font-family: monospace;
                            padding: 20px;
                            font-size: 12px;
                        }
                        .text-center { text-align: center; }
                        .font-bold { font-weight: bold; }
                        .divider { margin: 10px 0; border-top: 1px dashed #000; }
                        .flex { display: flex; justify-content: space-between; }
                        .mt-4 { margin-top: 1rem; }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
            </html>
        `);

            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();
        }, 100); // Tunggu sejenak untuk render selesai
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Transaksi" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Data Transaksi</h2>
                    <Button variant={'outline'} className="cursor-pointer" onClick={() => router.get(route('transactions.pos'))}>
                        <HandCoins />
                        Go to Kasir
                    </Button>
                </div>

                <input
                    type="text"
                    placeholder="Cari nama customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

                <DataTable
                    data={transactions.data}
                    from={transactions.from}
                    to={transactions.to}
                    total={transactions.total}
                    links={transactions.links}
                    columns={[
                        {
                            title: '#',
                            render: (_, index) => <span className="text-sm">{index}</span>,
                        },
                        {
                            title: 'Customer',
                            render: (transaction) => <span className="text-sm font-medium">{transaction.customer}</span>,
                        },
                        {
                            title: 'Total',
                            render: (transaction) => <span className="text-sm font-medium">{formatPrice(transaction.total_price)}</span>,
                        },
                        {
                            title: 'Metode Pembayaran',
                            render: (transaction) => {
                                const { label, className } = getPaymentMethodStyle(transaction.payment_method);
                                return <span className={className}>{label}</span>;
                            },
                        },
                        {
                            title: 'Status',
                            render: (transaction) => {
                                const { label, className } = getTransactionStatusStyle(transaction.status);

                                return <span className={className}>{label}</span>;
                            },
                        },
                        {
                            title: 'Aksi',
                            className: 'text-right',
                            render: (transaction) => (
                                <div className="flex justify-end gap-2">
                                    <button type="button" className="cursor-pointer" onClick={() => handlePrint(transaction)}>
                                        <Printer size={20} className="transition-all hover:text-blue-400" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedTransaction(transaction);
                                            setOpenDetailModal(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                    >
                                        Lihat
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedTransaction(transaction);
                                            setOpenDeleteModal(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {/* Modal Detail Transaction (baru diimplementasikan dari UserIndex) */}
            <Modal isOpen={openDetailModal} onClose={() => setOpenDetailModal(false)} title="Transaksi" size="lg">
                {selectedTransaction && (
                    <div className="space-y-6 rounded-lg bg-white py-6 text-sm text-gray-700 dark:bg-zinc-900 dark:text-gray-200">
                        <div className="grid grid-cols-1 gap-4 border-b pb-6 md:grid-cols-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Customer</span>
                                <span className="text-base font-semibold">{selectedTransaction.customer}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                                <span className="text-base">{selectedTransaction.status}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Metode Pembayaran</span>
                                <span className="text-base">{selectedTransaction.payment_method}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Dibuat Pada</span>
                                <span className="text-base">
                                    {selectedTransaction.created_at
                                        ? new Date(selectedTransaction.created_at).toLocaleDateString('id-ID', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-lg font-medium">Detail Transaksi</h1>
                        <div className="border-b pb-6">
                            {selectedTransaction.transaction_details.map((td, index) => (
                                <div className="grid grid-cols-4 gap-x-2 py-1" key={index}>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Product</span>
                                        <span className="text-sm">{td.product.name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Quantity</span>
                                        <span className="text-sm">{td.qty}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                                        <span className="text-sm">{formatPrice(td.price)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Subtotal</span>
                                        <span className="text-sm">{formatPrice(td.subtotal)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            {/* Total */}
                            <div className="flex flex-col">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-lg font-semibold">{formatPrice(selectedTransaction.total_price)}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant={'secondary'} onClick={() => setOpenDetailModal(false)} className="cursor-pointer">
                                Tutup
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                title="Konfirmasi Hapus"
                size="sm"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setOpenDeleteModal(false)} variant="secondary">
                            Batal
                        </Button>
                        <Button onClick={handleDelete} className="bg-red-700 hover:bg-red-800">
                            Hapus
                        </Button>
                    </div>
                }
            >
                Apakah Anda yakin ingin menghapus transaksi dari customer{' '}
                <strong className="text-red-600 dark:text-red-400">{selectedTransaction?.customer}</strong>? Tindakan ini tidak dapat dibatalkan.
            </Modal>

            {selectedTransaction && <PrintReceipt transaction={selectedTransaction} />}
        </AppLayout>
    );
}
