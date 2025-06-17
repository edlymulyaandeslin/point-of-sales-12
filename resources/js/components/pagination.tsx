import type { PaginationLink } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
    from: number;
    to: number;
    total: number;
    links: PaginationLink[];
};

export default function Pagination({ from, to, total, links }: PaginationProps) {
    return (
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Menampilkan <span className="font-medium">{from}</span> sampai <span className="font-medium">{to}</span> dari{' '}
                <span className="font-medium">{total}</span> entri
            </p>

            <div className="flex flex-wrap items-center justify-center gap-1">
                {links.map((link, index) => {
                    const isPrev = link.label.includes('Previous');
                    const isNext = link.label.includes('Next');
                    const label = link.label.replace(/&laquo;|&raquo;/g, '').trim();

                    const baseClass = 'inline-flex items-center gap-1 rounded-md border px-3 py-1 text-sm font-medium transition-colors';
                    const activeClass = link.active
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700';
                    const disabledClass = !link.url ? 'cursor-not-allowed opacity-50 pointer-events-none' : '';

                    const content = (
                        <>
                            {isPrev && <ChevronLeft size={16} />}
                            {!isPrev && !isNext && label}
                            {isNext && <ChevronRight size={16} />}
                        </>
                    );

                    return link.url ? (
                        <Link key={index} href={link.url} className={`${baseClass} ${activeClass} ${disabledClass}`}>
                            {content}
                        </Link>
                    ) : (
                        <span key={index} className={`${baseClass} ${activeClass} ${disabledClass}`}>
                            {content}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
