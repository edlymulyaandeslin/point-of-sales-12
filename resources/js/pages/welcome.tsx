import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function LandingPage() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="POS App - Solusi Kasir Digital UMKM">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
                {/* Hero Section */}
                <header className="flex w-full items-center justify-between bg-white px-8 py-6 shadow-md dark:bg-zinc-800">
                    <h1 className="text-3xl font-black text-blue-700 dark:text-white">
                        POS<span className="text-blue-500">App</span>
                    </h1>
                    <nav className="space-x-6">
                        <Link href="#features" className="hover:underline">
                            Fitur
                        </Link>
                        <Link href="#pricing" className="hover:underline">
                            Harga
                        </Link>
                        <Link href="#testimonials" className="hover:underline">
                            Testimoni
                        </Link>
                        {auth.user ? (
                            <Link href={route('dashboard')} className="font-semibold text-blue-600">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="font-medium">
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                                >
                                    Coba Gratis
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="px-8 py-20 lg:px-24">
                    <section className="flex flex-col-reverse items-center justify-between gap-12 lg:flex-row">
                        <div className="max-w-xl text-center lg:text-left">
                            <h2 className="mb-6 text-5xl leading-tight font-extrabold">Kelola Bisnis Anda Lebih Mudah dengan POSApp</h2>
                            <p className="mb-8 text-lg">
                                Sistem kasir online yang cepat, aman, dan praktis. Cocok untuk semua jenis usaha — dari UMKM hingga toko ritel besar.
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-blue-700"
                                >
                                    Daftar Gratis Sekarang
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg border border-blue-600 px-8 py-3 text-base font-semibold text-blue-600 transition-all hover:bg-blue-100 dark:hover:bg-zinc-700"
                                >
                                    Sudah Punya Akun?
                                </Link>
                            </div>
                        </div>
                        <img src="/image/hero.png" alt="POS Hero" className="max-w-md rounded-xl shadow-2xl" />
                    </section>

                    {/* Features Section */}
                    <section id="features" className="mt-32 text-center">
                        <h3 className="mb-8 text-3xl font-bold">Fitur Unggulan</h3>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div>
                                <h4 className="mb-2 text-xl font-semibold">📦 Manajemen Stok</h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300">Kelola barang dengan cepat, pantau stok otomatis.</p>
                            </div>
                            <div>
                                <h4 className="mb-2 text-xl font-semibold">🧾 Cetak Struk & Invoice</h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300">Langsung cetak struk digital atau kirim invoice via email.</p>
                            </div>
                            <div>
                                <h4 className="mb-2 text-xl font-semibold">📈 Laporan Keuangan</h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300">Pantau profit & performa bisnis real-time dari dashboard.</p>
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section id="pricing" className="mt-32 text-center">
                        <h3 className="mb-10 text-3xl font-bold">Paket Harga</h3>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="rounded-xl border p-6 shadow transition hover:scale-105">
                                <h4 className="mb-2 text-xl font-bold">Gratis</h4>
                                <p className="mb-4 text-sm">Untuk pemula & UMKM baru.</p>
                                <p className="mb-4 text-2xl font-bold">Rp 0</p>
                                <ul className="mb-6 space-y-2 text-sm">
                                    <li>✔ Transaksi harian</li>
                                    <li>✔ 1 pengguna</li>
                                    <li>✔ Laporan dasar</li>
                                </ul>
                                <Link href={route('register')} className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white">
                                    Mulai
                                </Link>
                            </div>
                            <div className="rounded-xl border bg-blue-50 p-6 shadow-lg transition hover:scale-105 dark:bg-zinc-700">
                                <h4 className="mb-2 text-xl font-bold">Pro</h4>
                                <p className="mb-4 text-sm">Untuk bisnis bertumbuh.</p>
                                <p className="mb-4 text-2xl font-bold">Rp 99.000/bulan</p>
                                <ul className="mb-6 space-y-2 text-sm">
                                    <li>✔ Semua fitur Gratis</li>
                                    <li>✔ 5 pengguna</li>
                                    <li>✔ Laporan lanjutan</li>
                                </ul>
                                <Link href={route('register')} className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white">
                                    Pilih Paket
                                </Link>
                            </div>
                            <div className="rounded-xl border p-6 shadow transition hover:scale-105">
                                <h4 className="mb-2 text-xl font-bold">Enterprise</h4>
                                <p className="mb-4 text-sm">Untuk toko besar & cabang.</p>
                                <p className="mb-4 text-2xl font-bold">Hubungi Kami</p>
                                <ul className="mb-6 space-y-2 text-sm">
                                    <li>✔ Semua fitur Pro</li>
                                    <li>✔ Tanpa batas pengguna</li>
                                    <li>✔ Dukungan premium</li>
                                </ul>
                                <Link href={''} className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white">
                                    Hubungi Sales
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section id="testimonials" className="mt-32 text-center">
                        <h3 className="mb-10 text-3xl font-bold">Apa Kata Mereka</h3>
                        <div className="grid gap-10 md:grid-cols-2">
                            <blockquote className="rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
                                <p className="text-md italic">
                                    "POSApp sangat membantu saya dalam mengelola toko tanpa ribet. Antarmukanya mudah dimengerti!"
                                </p>
                                <footer className="mt-4 font-semibold">— Dita, Pemilik Toko Kue</footer>
                            </blockquote>
                            <blockquote className="rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
                                <p className="text-md italic">
                                    "Saya bisa langsung tahu omset harian, mingguan, dan stok tanpa harus buka-buku lagi."
                                </p>
                                <footer className="mt-4 font-semibold">— Budi, Usaha Elektronik</footer>
                            </blockquote>
                        </div>
                    </section>
                </main>

                <footer className="mt-20 border-t border-zinc-200 py-10 text-center text-sm text-gray-500 dark:border-zinc-700 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} POS App. All rights reserved.
                </footer>
            </div>
        </>
    );
}
