import DataTable from '@/components/data-table';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Purchase } from '@/types';
import { formatPrice } from '@/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchases',
        href: '/purchases',
    },
];

export default function Index({ purchases }: { purchases: PaginatedData<Purchase> }) {
    const { props } = usePage<{ purchases: PaginatedData<Purchase>; search?: string }>();
    const initialSearch = props.search || '';
    const [search, setSearch] = useState(initialSearch);
    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Debounce search
    useEffect(() => {
        if (search !== initialSearch) {
            const delayDebounce = setTimeout(() => {
                router.get('/purchases', { search }, { preserveState: true, replace: true });
            }, 400);

            return () => clearTimeout(delayDebounce);
        }
    }, [search, initialSearch]);

    const handleDelete = () => {
        if (!selectedPurchase) return;

        router.delete(`/purchases/${selectedPurchase.id}`, {
            onSuccess: () => {
                setOpenDeleteModal(false);
                setSelectedPurchase(null);
            },
            onError: (err) => {
                console.error('Gagal hapus pembelian:', err);
                alert('Gagal menghapus pembelian. Coba lagi.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Pembelian" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Data Pembelian</h2>
                    <Link
                        href="/purchases/create"
                        className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
                    >
                        + Tambah Pembelian
                    </Link>
                </div>

                <input
                    type="text"
                    placeholder="Cari nama supplier..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

                <DataTable
                    data={purchases.data}
                    from={purchases.from}
                    to={purchases.to}
                    total={purchases.total}
                    links={purchases.links}
                    columns={[
                        {
                            title: '#',
                            render: (_, index) => <span className="text-sm">{index}</span>,
                        },
                        {
                            title: 'Supplier',
                            render: (purchase) => <span className="text-sm font-medium">{purchase.supplier.name}</span>,
                        },
                        {
                            title: 'Produk',
                            render: (purchase) => <span className="text-sm font-medium">{purchase.product.name}</span>,
                        },
                        {
                            title: 'Kuantitas',
                            render: (purchase) => <span className="text-sm font-medium">{purchase.qty}</span>,
                        },
                        {
                            title: 'Harga',
                            render: (purchase) => <span className="text-sm font-medium">{formatPrice(purchase.price)}</span>,
                        },
                        {
                            title: 'Total',
                            render: (purchase) => <span className="text-sm font-medium">{formatPrice(purchase.subtotal)}</span>,
                        },
                        {
                            title: 'Aksi',
                            className: 'text-right',
                            render: (purchase) => (
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedPurchase(purchase);
                                            setOpenDetailModal(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                    >
                                        Lihat
                                    </button>
                                    {/* <Link
                                        href={`/purchases/${purchase.id}/edit`}
                                        className="inline-flex items-center rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                                    >
                                        Edit
                                    </Link> */}
                                    <button
                                        onClick={() => {
                                            setSelectedPurchase(purchase);
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

            {/* Modal Detail Purchase (baru diimplementasikan dari UserIndex) */}
            <Modal isOpen={openDetailModal} onClose={() => setOpenDetailModal(false)} title="Pembelian" size="lg">
                {selectedPurchase && (
                    <div className="space-y-6 rounded-lg bg-white py-6 text-sm text-gray-700 dark:bg-zinc-900 dark:text-gray-200">
                        <div className="grid grid-cols-1 gap-4 border-b pb-6 md:grid-cols-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Supplier</span>
                                <span className="text-base font-semibold">{selectedPurchase.supplier.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Dibuat Pada</span>
                                <span className="text-base">
                                    {selectedPurchase.created_at
                                        ? new Date(selectedPurchase.created_at).toLocaleDateString('id-ID', {
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
                        <h1 className="text-lg font-medium">Detail Pembelian</h1>
                        <div className="border-b pb-6">
                            <div className="grid grid-cols-4 gap-x-2 gap-y-3">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Product</span>
                                    <span className="text-base">{selectedPurchase.product.name}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Quantity</span>
                                    <span className="text-base">{selectedPurchase.qty}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                                    <span className="text-base">{formatPrice(selectedPurchase.product.price)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Subtotal</span>
                                    <span className="text-base">{formatPrice(selectedPurchase.subtotal)}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            {/* Total */}
                            <div className="flex flex-col">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-lg font-semibold">{formatPrice(selectedPurchase.subtotal)}</span>
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
                Apakah Anda yakin ingin menghapus pembelian dari supplier{' '}
                <strong className="text-red-600 dark:text-red-400">{selectedPurchase?.supplier.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </Modal>
        </AppLayout>
    );
}
