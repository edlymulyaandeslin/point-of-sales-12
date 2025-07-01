import DataTable from '@/components/data-table';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Product } from '@/types';
import { formatPrice } from '@/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

export default function Index({ products }: { products: PaginatedData<Product> }) {
    const { props } = usePage<{ products: PaginatedData<Product>; search?: string }>();
    const initialSearch = props.search || '';
    const [search, setSearch] = useState(initialSearch);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Debounce search
    useEffect(() => {
        if (search !== initialSearch) {
            const delayDebounce = setTimeout(() => {
                router.get('/products', { search }, { preserveState: true, replace: true });
            }, 400);

            return () => clearTimeout(delayDebounce);
        }
    }, [search, initialSearch]);

    const handleDelete = () => {
        if (!selectedProduct) return;

        router.delete(`/products/${selectedProduct.id}`, {
            onSuccess: () => {
                setOpenDeleteModal(false);
                setSelectedProduct(null);
            },
            onError: (err) => {
                console.error('Gagal hapus produk:', err);
                alert('Gagal menghapus produk. Coba lagi.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Produk" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Data Produk</h2>
                    <Link
                        href="/products/create"
                        className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
                    >
                        + Tambah Produk
                    </Link>
                </div>
                <input
                    type="text"
                    placeholder="Cari nama produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

                <DataTable
                    data={products.data}
                    from={products.from}
                    to={products.to}
                    total={products.total}
                    links={products.links}
                    columns={[
                        {
                            title: '#',
                            render: (_, index) => <span className="text-sm">{index}</span>,
                        },
                        {
                            title: 'Kategori',
                            render: (product) => <span className="text-sm font-medium capitalize">{product.category.name}</span>,
                        },
                        {
                            title: 'Nama',
                            render: (product) => <span className="text-sm font-medium capitalize">{product.name}</span>,
                        },
                        {
                            title: 'Harga',
                            render: (product) => <span className="text-sm font-medium">{formatPrice(product.price)}</span>,
                        },
                        {
                            title: 'Stok',
                            render: (product) => <span className="text-sm font-medium">{product.stock}</span>,
                        },
                        {
                            title: 'Gambar',
                            render: (product) => (
                                <img
                                    src={
                                        product.image
                                            ? `/storage/${product.image}`
                                            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6xKMudVFtik4Lw_hXqz_VD2tZtPlBDezD0w&s'
                                    }
                                    alt="image product"
                                    className="h-14 w-20 rounded object-cover"
                                />
                            ),
                        },
                        {
                            title: 'Aksi',
                            className: 'text-right',
                            render: (product) => (
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setOpenDetailModal(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                    >
                                        Lihat
                                    </button>
                                    <Link
                                        href={`/products/${product.id}/edit`}
                                        className="inline-flex items-center rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
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

            {/* Modal Detail Product (baru diimplementasikan dari UserIndex) */}
            <Modal isOpen={openDetailModal} onClose={() => setOpenDetailModal(false)} title="Detail Product" size="lg">
                {selectedProduct && (
                    <div className="space-y-6 rounded-lg bg-white py-6 text-sm text-gray-700 dark:bg-zinc-900 dark:text-gray-200">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Kategori</span>
                                <span className="text-base font-semibold">{selectedProduct.category.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Nama Produk</span>
                                <span className="text-base font-semibold">{selectedProduct.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Harga</span>
                                <span className="text-base font-semibold">{formatPrice(selectedProduct.price)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Stok</span>
                                <span className="text-base font-semibold">{selectedProduct.stock}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Dibuat Pada</span>
                                <span className="text-base">
                                    {selectedProduct.created_at
                                        ? new Date(selectedProduct.created_at).toLocaleDateString('id-ID', {
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
                                    {selectedProduct.updated_at
                                        ? new Date(selectedProduct.updated_at).toLocaleDateString('id-ID', {
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
                                <p className="text-muted-foreground mb-1 text-sm">Preview:</p>
                                <img
                                    src={
                                        selectedProduct.image
                                            ? `/storage/${selectedProduct.image}`
                                            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6xKMudVFtik4Lw_hXqz_VD2tZtPlBDezD0w&s'
                                    }
                                    alt="Preview Produk"
                                    className="h-40 w-auto max-w-[300px] rounded-lg border border-gray-300 object-cover dark:border-gray-700"
                                />
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
                Apakah Anda yakin ingin menghapus produk <strong className="text-red-600 dark:text-red-400">{selectedProduct?.name}</strong>? Tindakan
                ini tidak dapat dibatalkan.
            </Modal>
        </AppLayout>
    );
}
