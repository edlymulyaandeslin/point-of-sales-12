import AppLayout from '@/layouts/app-layout'; // Pastikan path ini benar
import type { BreadcrumbItem, Product, Supplier } from '@/types'; // Hanya butuh BreadcrumbItem karena Role tidak lagi digunakan
import { Head, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchases', href: '/purchases' },
    { title: 'Create', href: '/purchases/create' },
];

export default function Create({ suppliers, products }: { suppliers: Supplier[]; products: Product[] }) {
    // Menggunakan hook useForm
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        total_price: 0,
        product_id: '',
        price: 0,
        qty: 1,
        subtotal: 0,
    });

    // Fungsi yang akan dipanggil saat form disubmit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(data);
        // post('/purchases');
    };

    const handleChangeProduct = (productId: string) => {
        const product = products.find((product) => product.id === parseInt(productId));

        if (product) {
            const price = product?.price;
            setData('product_id', productId);
            setData('price', price);

            const subtotal = data.qty * price;
            setData('subtotal', subtotal);
        }
    };

    const handleChangeQty = (e: React.ChangeEvent<HTMLInputElement>) => {
        const qty = e.target.value ? parseInt(e.target.value) : 1;
        setData('qty', qty);

        const subtotal = qty * data.price;
        setData('subtotal', subtotal);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pembelian" />

            <section className="w-full px-6 py-10 md:px-12 lg:px-20">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Tambah Pembelian</h1>
                    <p className="text-muted-foreground mt-2 text-base">Masukkan informasi pembelian pada form berikut.</p>
                </div>

                {/* Form dengan hanya input Nama dan Nomor Telepon */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Supplier */}
                    <div>
                        <Label htmlFor="supplier_id">Supplier</Label>
                        <Select value={data.supplier_id} onValueChange={(value) => setData('supplier_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Supplier" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers.map((supplier) => (
                                    <SelectItem key={supplier.id} value={String(supplier.id)}>
                                        {supplier.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.supplier_id && <p className="mt-1 text-sm text-red-500">{errors.supplier_id}</p>}
                    </div>

                    {/* Produk */}
                    <div>
                        <Label htmlFor="product_id">Produk</Label>
                        <Select value={data.product_id} onValueChange={(value) => handleChangeProduct(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Produk" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem key={product.id} value={String(product.id)}>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.product_id && <p className="mt-1 text-sm text-red-500">{errors.product_id}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <Label htmlFor="price">Harga</Label>
                        <Input id="price" value={data.price} onChange={() => ''} placeholder="Harga produk" readOnly />
                        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                    </div>

                    {/* Qty */}
                    <div>
                        <Label htmlFor="qty">Qty</Label>
                        <Input id="qty" value={data.qty} type="number" min={1} onChange={handleChangeQty} placeholder="Jumlah" />
                        {errors.qty && <p className="mt-1 text-sm text-red-500">{errors.qty}</p>}
                    </div>

                    <div>
                        <Label htmlFor="subtotal">Subtotal</Label>
                        <Input id="subtotal" value={data.subtotal} placeholder="Subtotal" readOnly />
                        {errors.subtotal && <p className="mt-1 text-sm text-red-500">{errors.subtotal}</p>}
                    </div>

                    {/* Tombol Submit Form */}
                    <div className="mt-4 flex justify-end md:col-span-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </section>
        </AppLayout>
    );
}
