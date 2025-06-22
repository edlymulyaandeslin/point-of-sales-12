import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Category, Product } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products' },
    { title: 'Edit', href: '/products/edit' },
];

export default function Edit({ product, categories }: { product: Product; categories: Category[] }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, setData, errors } = useForm({
        category_id: product.category_id || '',
        name: product.name || '',
        price: product.price || '',
        stock: product.stock,
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

        setIsSubmitting(true);

        router.post(
            route('products.update', product.id),
            {
                ...data,
                _method: 'PUT',
            },
            {
                forceFormData: true,
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />

            <section className="w-full px-6 py-10 md:px-12 lg:px-20">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Edit Product</h1>
                    <p className="text-muted-foreground mt-2 text-base">Ubah informasi produk pada form berikut.</p>
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

                    {/* Harga */}
                    <div>
                        <Label htmlFor="price">Harga</Label>
                        <Input id="price" value={data.price} onChange={(e) => setData('price', e.target.value)} placeholder="Harga produk" />
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
                        <Input id="image" type="file" onChange={handleImageChange} />
                        {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}

                        {previewUrl ? (
                            <div className="mt-4">
                                <p className="text-muted-foreground mb-1 text-sm">Preview:</p>
                                <img
                                    src={previewUrl}
                                    alt="Preview Produk"
                                    className="h-48 w-auto rounded-lg border border-gray-300 object-contain dark:border-gray-700"
                                />
                            </div>
                        ) : (
                            <div className="mt-4">
                                <p className="text-muted-foreground mb-1 text-sm">Preview:</p>
                                <img
                                    src={
                                        product.image
                                            ? `/storage/${product.image}`
                                            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6xKMudVFtik4Lw_hXqz_VD2tZtPlBDezD0w&s'
                                    }
                                    alt="Preview Produk"
                                    className="h-48 w-auto rounded-lg border border-gray-300 object-contain dark:border-gray-700"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tombol Submit */}
                    <div className="mt-4 flex justify-end md:col-span-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </section>
        </AppLayout>
    );
}
