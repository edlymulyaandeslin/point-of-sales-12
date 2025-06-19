export const formatPrice = (value: number): string => {
    return 'Rp ' + value.toLocaleString();
};

// format tanggal => 19 Jan 2025
export const formatSimpleDate = (tanggal: string | number | Date): string => {
    const date = new Date(tanggal);

    const bulan: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const day = String(date.getDate()).padStart(2, '0');
    const month = bulan[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};

// custom style transactionstatus => pending, completed, cancelled
type StatusStyle = {
    label: string;
    className: string;
};

export const getTransactionStatusStyle = (status: string): StatusStyle => {
    const normalized = status.toLowerCase();

    switch (normalized) {
        case 'pending':
            return {
                label: 'Pending',
                className:
                    'inline-block rounded-md px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            };
        case 'completed':
            return {
                label: 'Selesai',
                className:
                    'inline-block rounded-md px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            };
        case 'cancelled':
            return {
                label: 'Dibatalkan',
                className: 'inline-block rounded-md px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            };
        default:
            return {
                label: status,
                className: 'inline-block rounded-md px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
            };
    }
};

// custom style payment method => cash, qris
export function getPaymentMethodStyle(method: string): StatusStyle {
    const normalized = method.toLowerCase();

    switch (normalized) {
        case 'cash':
            return {
                label: 'Cash',
                className:
                    'inline-block rounded-md px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
            };
        case 'qris':
            return {
                label: 'QRIS',
                className:
                    'inline-block rounded-md px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
            };
        default:
            return {
                label: method,
                className:
                    'inline-block rounded-md px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300',
            };
    }
}
