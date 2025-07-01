import DataTable from '@/components/data-table';
import PrintLaporan from '@/components/PrintLaporan';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Transaction } from '@/types';
import { formatPrice, getPaymentMethodStyle, getTransactionStatusStyle } from '@/utils';
import { Head, router, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Laporan Keuangan', href: '/laporan-keuangan' }];

export default function LaporanKeuangan({ transactions }: { transactions: PaginatedData<Transaction> }) {
    const { props } = usePage<{
        transactions: PaginatedData<Transaction>;
        search: string;
        date_from?: string;
        date_to?: string;
    }>();

    const [search, setSearch] = useState(props.search);
    const [dateFrom, setDateFrom] = useState(props.date_from || '');
    const [dateTo, setDateTo] = useState(props.date_to || '');

    // Debounced Search
    useEffect(() => {
        const timeout = setTimeout(() => {
            const query: Record<string, any> = { search };

            if (dateFrom && dateTo) {
                query.date_from = dateFrom;
                query.date_to = dateTo;
            }

            router.get('/laporan-keuangan', query, {
                preserveState: true,
                replace: true,
            });
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const handleFilterDate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!dateFrom || !dateTo) return;

        router.get('/laporan-keuangan', { search, date_from: dateFrom, date_to: dateTo }, { preserveState: true, replace: true });
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=1024,height=768');

        if (printWindow) {
            const content = `
            <!DOCTYPE html>
            <html>
                ${ReactDOMServer.renderToStaticMarkup(
                    <PrintLaporan transactions={transactions.data} totalIncome={totalIncome} dateFrom={dateFrom} dateTo={dateTo} />,
                )}
            </html>
        `;
            printWindow.document.write(content);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    };

    const totalIncome = transactions.data.reduce((acc, t) => acc + t.total_price, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Keuangan" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-2xl font-bold">Laporan Keuangan</h2>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak Laporan
                    </Button>
                </div>

                <div className="text-lg font-semibold">
                    Total Pemasukan: <span className="text-green-600 dark:text-green-400">{formatPrice(totalIncome)}</span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama customer..."
                            className="focus:border-primary w-full max-w-xs rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                        <Button variant="outline" onClick={() => router.get(route('laporan.index'))}>
                            Reset
                        </Button>
                    </div>

                    <form onSubmit={handleFilterDate} className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            required
                        />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            required
                        />
                        <Button type="submit" variant="outline">
                            Filter
                        </Button>
                    </form>
                </div>

                <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <DataTable
                        data={transactions.data}
                        from={transactions.from}
                        to={transactions.to}
                        total={transactions.total}
                        links={transactions.links}
                        columns={[
                            {
                                title: 'Tanggal',
                                render: (t) => <span className="text-sm">{new Date(t.created_at).toLocaleDateString('id-ID')}</span>,
                            },
                            {
                                title: 'Customer',
                                render: (t) => <span className="text-sm">{t.customer}</span>,
                            },
                            {
                                title: 'Metode Pembayaran',
                                render: (t) => {
                                    const { label, className } = getPaymentMethodStyle(t.payment_method);
                                    return <span className={`rounded px-2 py-1 text-xs font-medium ${className}`}>{label}</span>;
                                },
                            },
                            {
                                title: 'Total',
                                render: (t) => <span className="text-sm font-semibold">{formatPrice(t.total_price)}</span>,
                            },
                            {
                                title: 'Status',
                                render: (t) => {
                                    const { label, className } = getTransactionStatusStyle(t.status);
                                    return <span className={`rounded px-2 py-1 text-xs font-medium ${className}`}>{label}</span>;
                                },
                            },
                        ]}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
