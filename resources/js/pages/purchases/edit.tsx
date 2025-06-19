import AppLayout from '@/layouts/app-layout'; // Pastikan path ini benar
import type { BreadcrumbItem, Category, Product } from '@/types'; // Hanya butuh BreadcrumbItem karena Role tidak lagi digunakan
import { Head, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products' },
    { title: 'Edit', href: '/products/edit' },
];

export default function Edit({ product, categories }: { product: Product; categories: Category[] }) {
    // Menggunakan hook useForm dengan state hanya untuk 'name' dan 'phone'
    const { data, setData, put, processing, errors } = useForm({
        category_id: product.category_id || '',
        name: product.name || '',
        price: product.price || '',
        stock: product.stock || '',
    });

    // Fungsi yang akan dipanggil saat form disubmit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />

            <section className="w-full px-6 py-10 md:px-12 lg:px-20">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Edit Product</h1>
                    <p className="text-muted-foreground mt-2 text-base">Masukkan informasi product baru pada form berikut.</p>
                </div>

                {/* Form  */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Input untuk Nama */}
                    <div>
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama produk" />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <Label htmlFor="category_id">Kategori</Label>
                        <Select value={String(data.category_id)} onValueChange={(value) => setData('category_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <Label htmlFor="price">Harga</Label>
                        <Input id="price" value={data.price} onChange={(e) => setData('price', e.target.value)} placeholder="Harga produk" />
                        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                    </div>

                    {/* Stock */}
                    <div>
                        <Label htmlFor="stock">Stok</Label>
                        <Input id="stock" value={data.stock} min={1} onChange={(e) => setData('stock', e.target.value)} placeholder="Jumlah stok" />
                        {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
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
