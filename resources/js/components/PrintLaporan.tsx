import { Transaction } from '@/types';
import { formatPrice, getPaymentMethodStyle, getTransactionStatusStyle } from '@/utils';

interface Props {
    transactions: Transaction[];
    totalIncome: number;
    dateFrom?: string;
    dateTo?: string;
}

export default function PrintLaporan({ transactions, totalIncome, dateFrom, dateTo }: Props) {
    return (
        <html>
            <head>
                <title>Laporan Keuangan</title>
                <style>{`
                    body {
                        font-family: 'Times New Roman', Times, serif;
                        padding: 40px;
                        color: #000;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .header p {
                        margin: 4px 0;
                        font-size: 14px;
                    }
                    .info {
                        margin-top: 20px;
                        font-size: 14px;
                    }
                    .total {
                        margin: 12px 0;
                        font-size: 16px;
                        font-weight: bold;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 16px;
                        font-size: 13px;
                    }
                    th, td {
                        border: 1px solid #444;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f0f0f0;
                    }
                    tr:nth-child(even) {
                        background-color: #fafafa;
                    }
                    .footer {
                        margin-top: 60px;
                        display: flex;
                        justify-content: flex-end;
                        font-size: 14px;
                    }
                    .signature {
                        margin-top: 60px;
                        text-align: right;
                        font-size: 14px;
                    }
                `}</style>
            </head>
            <body>
                <div className="header">
                    <h1>LAPORAN KEUANGAN</h1>
                    <p>POS Kasir Toko Sukses Abadi</p>
                    {dateFrom && dateTo && (
                        <p>
                            Periode: <strong>{dateFrom}</strong> s/d <strong>{dateTo}</strong>
                        </p>
                    )}
                </div>

                <div className="info">
                    <div className="total">Total Pemasukan: {formatPrice(totalIncome)}</div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Tanggal</th>
                            <th>Customer</th>
                            <th>Metode Pembayaran</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{new Date(t.created_at).toLocaleDateString('id-ID')}</td>
                                <td>{t.customer}</td>
                                <td>{getPaymentMethodStyle(t.payment_method).label}</td>
                                <td>{formatPrice(t.total_price)}</td>
                                <td>{getTransactionStatusStyle(t.status).label}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                TOTAL
                            </td>
                            <td colSpan={2} style={{ fontWeight: 'bold' }}>
                                {formatPrice(totalIncome)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="signature">
                    <p>Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
                    <br />
                    <p>_________________________</p>
                    <p>
                        <em>Tanda Tangan</em>
                    </p>
                </div>
            </body>
        </html>
    );
}
