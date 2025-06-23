import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Category, Product } from '@/types';
import { formatPrice } from '@/utils';
import { Head, router } from '@inertiajs/react';
import { ScrollArea } from '@radix-ui/themes';
import axios from 'axios';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

type CartItem = Product & { quantity: number };

export default function Pos({ products, categories, paymentMethods }: { products: Product[]; categories: Category[]; paymentMethods: string[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string>('semua');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState<string>('Umum');
    const [paymentMethod, setPaymentMethod] = useState<string>(paymentMethods[0]);

    const filteredProducts: Product[] = selectedCategory === 'semua' ? products : products.filter((p) => p.category?.name === selectedCategory);

    const addToCart = (product: Product): void => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number): void => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const total: number = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const incrementQuantity = (id: number): void => {
        setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
    };

    const decrementQuantity = (id: number): void => {
        setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item)).filter((item) => item.quantity > 0));
    };

    const [cashGiven, setCashGiven] = useState<number | ''>('');
    const change = typeof cashGiven === 'number' ? cashGiven - total : 0;

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await axios.post(route('transactions.checkout'), {
            customer: customerName,
            money_given: cashGiven,
            payment_method: paymentMethod,
            carts: cart,
        });

        const is_success = await response.data.success;
        const message = await response.data.message;
        if (is_success) {
            toast.success(message);
            resetForm();
        } else {
            toast.error(message);
        }
    };

    const resetForm = () => {
        setCart([]);
        setPaymentMethod(paymentMethods[0]);
        setCashGiven('');
    };

    useEffect(() => {
        if (paymentMethod == 'qris') {
            setCashGiven(total);
        }
    }, [paymentMethod, total]);
    return (
        <div className="min-h-screen bg-zinc-50 p-4 dark:bg-zinc-900">
            <Toaster richColors />

            <Head title="Transaksi" />

            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-zinc-800 dark:text-white">Transaksi</h1>
                <button
                    onClick={() => router.visit('/dashboard')}
                    className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 hover:underline dark:text-zinc-300"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Aplikasi
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                {/* Kategori - Responsif */}
                <div className="mb-4 md:col-span-2 md:mb-0">
                    <h2 className="hidden text-sm font-semibold text-zinc-600 md:block dark:text-zinc-200">Kategori</h2>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
                        <Button
                            size="sm"
                            variant={selectedCategory === 'semua' ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory('semua')}
                            className="flex-shrink-0 whitespace-nowrap"
                        >
                            Semua
                        </Button>
                        {categories.map((cat, index) => (
                            <Button
                                key={index}
                                size="sm"
                                variant={selectedCategory === cat.name ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory(cat.name)}
                                className="flex-shrink-0 whitespace-nowrap capitalize"
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                    <div className="mt-2 hidden flex-col gap-2 md:flex">
                        <Button
                            variant={selectedCategory === 'semua' ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory('semua')}
                            className="justify-start text-sm"
                        >
                            Semua
                        </Button>
                        {categories.map((cat, index) => (
                            <Button
                                key={index}
                                variant={selectedCategory === cat.name ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory(cat.name)}
                                className="justify-start text-sm capitalize"
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Produk */}
                <div className="md:col-span-6">
                    <h2 className="mb-2 text-sm font-semibold text-zinc-600 dark:text-zinc-200">Produk</h2>
                    <ScrollArea className="h-[70vh] pr-2">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <Card
                                    key={product.id}
                                    className="group flex cursor-pointer flex-col rounded-xl border bg-white p-3 shadow transition duration-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
                                    onClick={() => addToCart(product)}
                                >
                                    <div className="relative mb-1 w-full overflow-hidden rounded-lg">
                                        <img
                                            src={
                                                product.image
                                                    ? `/storage/${product.image}`
                                                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6xKMudVFtik4Lw_hXqz_VD2tZtPlBDezD0w&s'
                                            }
                                            alt={product.name}
                                            className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between gap-1 px-1 text-left">
                                        <span className="line-clamp-2 text-sm font-medium text-zinc-800 capitalize dark:text-white">
                                            {product.name}
                                        </span>
                                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                            {formatPrice(product.price)}
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Ringkasan Transaksi */}
                <div className="md:col-span-4">
                    <div className="rounded-xl border p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                        <h2 className="mb-3 text-sm font-semibold text-zinc-600 dark:text-white">Keranjang</h2>
                        <ScrollArea className="h-[45vh] pr-1">
                            {cart.length === 0 ? (
                                <p className="text-sm text-zinc-500">Belum ada item</p>
                            ) : (
                                <ul className="space-y-3">
                                    {cart.map((item) => (
                                        <li key={item.id} className="flex flex-col gap-1 rounded-md border-b py-2 text-sm dark:border-zinc-700">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-zinc-700 dark:text-zinc-200">{item.name}</p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatPrice(item.price)} / pcs</p>
                                                </div>
                                                <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                            </div>
                                            <div className="mt-1 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => decrementQuantity(item.id)}
                                                        className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        –
                                                    </Button>
                                                    <span className="w-6 text-center">{item.quantity}</span>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => incrementQuantity(item.id)}
                                                        className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </ScrollArea>

                        <div className="mt-4 space-y-3 text-sm">
                            <label htmlFor="">Customer</label>
                            <Input
                                placeholder="Nama Customer"
                                className="border-gray-600"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />

                            <div className="flex items-center gap-2">
                                {paymentMethods.map((method) => (
                                    <Button
                                        key={method}
                                        variant={paymentMethod === method ? 'default' : 'outline'}
                                        onClick={() => setPaymentMethod(method)}
                                        className="flex-1 uppercase"
                                    >
                                        {method}
                                    </Button>
                                ))}
                            </div>

                            <div>
                                <label htmlFor="cash" className="mb-1 block">
                                    Uang Diberikan
                                </label>
                                <Input
                                    id="cash"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    className="border-gray-600"
                                    value={
                                        typeof cashGiven === 'number'
                                            ? cashGiven.toLocaleString('en-US') // gunakan en-US agar separator pakai koma
                                            : ''
                                    }
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(/[^\d]/g, ''); // hapus semua karakter kecuali angka
                                        const parsed = parseInt(raw);
                                        if (isNaN(parsed)) {
                                            setCashGiven('');
                                        } else {
                                            setCashGiven(parsed);
                                        }
                                    }}
                                    readOnly={paymentMethod == 'qris'}
                                />
                            </div>

                            <div className="flex justify-between font-semibold text-zinc-700 dark:text-white">
                                <span>Total:</span>
                                <span>{formatPrice(total)}</span>
                            </div>

                            <div className="flex justify-between font-semibold text-zinc-700 dark:text-white">
                                <span>Kembalian:</span>
                                <span className={change < 0 ? 'text-red-500' : ''}>
                                    {change < 0 ? `Kurang ${formatPrice(Math.abs(change))}` : formatPrice(change)}
                                </span>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || customerName === '' || typeof cashGiven !== 'number' || cashGiven < total}
                                className="mt-2 w-full bg-green-600 hover:bg-green-700"
                            >
                                Bayar Sekarang
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
