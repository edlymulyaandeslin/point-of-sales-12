import DataTable from '@/components/data-table';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Customer } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: '/customers',
    },
];

export default function Index({ customers }: { customers: PaginatedData<Customer> }) {
    const { props } = usePage<{ customers: PaginatedData<Customer>; search?: string }>();
    const initialSearch = props.search || '';
    const [search, setSearch] = useState(initialSearch);
    const [openDetailModal, setOpenDetailModal] = useState(false); // Mengganti 'open' menjadi 'openDetailModal' agar lebih jelas
    const [openDeleteModal, setOpenDeleteModal] = useState(false); // Mengganti 'openDelete' menjadi 'openDeleteModal' agar lebih jelas
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    // Effect untuk debouncing pencarian
    useEffect(() => {
        // Cek apakah nilai pencarian berubah dari nilai awal yang diterima dari props
        if (search !== initialSearch) {
            const delayDebounce = setTimeout(() => {
                router.get('/customers', { search }, { preserveState: true, replace: true });
            }, 400); // Debounce selama 400ms

            return () => clearTimeout(delayDebounce); // Cleanup timer jika search berubah lagi
        }
    }, [search, initialSearch]); // Dependensi: search dan initialSearch

    // Handler untuk menghapus customer
    const handleDelete = async () => {
        if (!selectedCustomer) return; // Pastikan ada customer yang dipilih

        // Menggunakan router.delete dengan onSuccess callback
        router.delete(`/customers/${selectedCustomer.id}`, {
            onSuccess: () => {
                setOpenDeleteModal(false); // Tutup modal setelah berhasil
                setSelectedCustomer(null); // Reset selectedCustomer
            },
            onError: (errors) => {
                // Tambahkan logika penanganan error jika diperlukan
                console.error('Error deleting customer:', errors);
                alert('Gagal menghapus customer. Silakan coba lagi.'); // Contoh notifikasi sederhana
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Customer" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Data Customer</h2>
                    <Link
                        href="/customers/create"
                        className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
                    >
                        + Tambah Customer
                    </Link>
                </div>

                <input
                    type="text"
                    placeholder="Cari nama customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

                <DataTable
                    data={customers.data}
                    from={customers.from}
                    to={customers.to}
                    total={customers.total}
                    links={customers.links}
                    columns={[
                        {
                            title: '#',
                            render: (_, index) => <span className="text-sm">{index}</span>,
                        },
                        {
                            title: 'Nama',
                            render: (customer) => <span className="text-sm font-medium">{customer.name}</span>,
                        },
                        {
                            title: 'Phone',
                            render: (customer) => <span className="text-sm">{customer.phone}</span>,
                        },
                        {
                            title: 'Aksi',
                            className: 'text-right',
                            render: (customer) => (
                                <div className="flex justify-end gap-2">
                                    {/* Tombol Lihat Detail */}
                                    <button
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            setOpenDetailModal(true);
                                        }}
                                        className="inline-flex items-center rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                    >
                                        Lihat
                                    </button>
                                    <Link
                                        href={route('customers.edit', customer.id)}
                                        className="inline-flex items-center rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            setOpenDeleteModal(true);
                                        }}
                                        className="inline-flex items-center rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {/* Modal Detail Customer (baru diimplementasikan dari UserIndex) */}
            <Modal isOpen={openDetailModal} onClose={() => setOpenDetailModal(false)} title="Detail Customer" size="lg">
                {selectedCustomer && (
                    <div className="space-y-6 rounded-lg bg-white py-6 text-sm text-gray-700 dark:bg-zinc-900 dark:text-gray-200">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Nama Lengkap</span>
                                <span className="text-base font-semibold">{selectedCustomer.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Telepon</span>
                                <span className="text-base">{selectedCustomer.phone}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Dibuat Pada</span>
                                <span className="text-base">
                                    {selectedCustomer.created_at
                                        ? new Date(selectedCustomer.created_at).toLocaleDateString('id-ID', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Diperbarui Pada</span>
                                <span className="text-base">
                                    {selectedCustomer.updated_at
                                        ? new Date(selectedCustomer.updated_at).toLocaleDateString('id-ID', {
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
                Apakah Anda yakin ingin menghapus customer <strong className="text-red-600 dark:text-red-400">{selectedCustomer?.name}</strong>?
                Tindakan ini tidak dapat dibatalkan.
            </Modal>
        </AppLayout>
    );
}
