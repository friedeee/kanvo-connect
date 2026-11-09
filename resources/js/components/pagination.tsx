import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/types/kanvo';
import { cn } from '@/lib/utils';

export function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            aria-label="Pagination"
            className="flex flex-wrap items-center justify-center gap-1"
        >
            {links.map((link, index) => {
                const label = link.label
                    .replace('&laquo;', '«')
                    .replace('&raquo;', '»');

                return link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={cn(
                            'min-w-9 rounded-md border px-3 py-1.5 text-center text-sm',
                            link.active
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'hover:bg-accent',
                        )}
                    >
                        {label}
                    </Link>
                ) : (
                    <span
                        key={index}
                        className="min-w-9 px-3 py-1.5 text-center text-sm text-muted-foreground"
                    >
                        {label}
                    </span>
                );
            })}
        </nav>
    );
}
