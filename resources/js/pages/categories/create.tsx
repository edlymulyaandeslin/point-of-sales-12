import AppLayout from '@/layouts/app-layout'; // Pastikan path ini benar
import type { BreadcrumbItem } from '@/types'; // Hanya butuh BreadcrumbItem karena Role tidak lagi digunakan
import { Head, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categories', href: '/categories' },
    { title: 'Create', href: '/categories/create' },
];

export default function Create() {
    // Menggunakan hook useForm dengan state hanya untuk 'name' dan 'phone'
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    // Fungsi yang akan dipanggil saat form disubmit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/categories');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Category" />

            <section className="w-full px-6 py-10 md:px-12 lg:px-20">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Tambah Category</h1>
                    <p className="text-muted-foreground mt-2 text-base">Masukkan informasi category baru pada form berikut.</p>
                </div>

                {/* Form dengan hanya input Nama dan Nomor Telepon */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Input untuk Nama */}
                    <div>
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama kategori" />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
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
