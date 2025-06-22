import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Category } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products' },
    { title: 'Create', href: '/products/create' },
];

export default function Create({ categories }: { categories: Category[] }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        name: '',
        price: '',
        stock: 0,
        image: null as File | null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/products', { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Product" />

            <section className="w-full px-6 py-10 md:px-12 lg:px-20">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Tambah Product</h1>
                    <p className="text-muted-foreground mt-2 text-base">Masukkan informasi product baru pada form berikut.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Nama Produk */}
                    <div>
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama produk" />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Kategori */}
                    <div>
                        <Label htmlFor="category_id">Kategori</Label>
                        <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
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

                    {/* Harga */}
                    <div>
                        <Label htmlFor="price">Harga</Label>
                        <Input id="price" type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} placeholder="0" />
                        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                    </div>

                    {/* Stok */}
                    <div>
                        <Label htmlFor="stock">Stok</Label>
                        <Input id="stock" value={data.stock} placeholder="Jumlah stok" readOnly />
                        <span className="text-xs font-medium text-gray-300">Stok hanya dapat ditambahkan pada menu purchases.</span>
                        {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
                    </div>

                    {/* Upload Gambar dengan Preview */}
                    <div className="md:col-span-2">
                        <Label htmlFor="image">Gambar Produk</Label>
                        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                        {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}

                        {previewUrl && (
                            <div className="mt-4">
                                <p className="text-muted-foreground mb-1 text-sm">Preview:</p>
                                <img
                                    src={previewUrl}
                                    alt="Preview Produk"
                                    className="h-48 w-auto rounded-lg border border-gray-300 object-contain dark:border-gray-700"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tombol Submit */}
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
