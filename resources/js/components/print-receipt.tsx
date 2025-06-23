import { Transaction } from '@/types';
import { formatPrice } from '@/utils';

export default function PrintReceipt({ transaction }: { transaction: Transaction }) {
    if (!transaction) return null;

    return (
        <div id="print-section" style={{ display: 'none' }}>
            <div className="text-center font-bold">TOKO Point Of Sales KITA</div>
            <div className="text-center">Jl. Contoh No. 123</div>
            <div className="text-center">Telp: 0812-3456-7890</div>
            <hr className="divider" />
            <div>Customer: {transaction.customer}</div>
            <div>Status: {transaction.status}</div>
            <div>Metode: {transaction.payment_method}</div>
            <div>Tanggal: {new Date(transaction.created_at).toLocaleString('id-ID')}</div>
            <hr className="divider" />
            {transaction.transaction_details.map((td, idx) => (
                <div key={idx}>
                    <div className="flex">
                        <span>{td.product.name}</span>
                        {/* <span>{formatPrice(td.price)}</span> */}
                    </div>
                    <div className="flex" style={{ fontSize: '10px' }}>
                        <span>
                            {td.qty} x {formatPrice(td.price)}
                        </span>
                        <span>{formatPrice(td.subtotal)}</span>
                    </div>
                </div>
            ))}
            <hr className="divider" />
            <div className="flex font-bold">
                <span>Total</span>
                <span>{formatPrice(transaction.total_price)}</span>
            </div>
            <div className="mt-4 text-center">*** Terima kasih ***</div>
        </div>
    );
}
