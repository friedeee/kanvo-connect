import { Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { Option } from '@/types/kanvo';

export function StatusTabs({
    statuses,
    current,
    href,
}: {
    statuses: Option[];
    current: string;
    href: (status: string) => NonNullable<InertiaLinkProps['href']>;
}) {
    return (
        <nav className="flex gap-1 overflow-x-auto border-b">
            {statuses.map((status) => (
                <Link
                    key={status.value}
                    href={href(status.value)}
                    className={cn(
                        '-mb-px border-b-2 px-3 py-2 text-sm whitespace-nowrap',
                        status.value === current
                            ? 'border-primary font-medium'
                            : 'border-transparent text-muted-foreground hover:text-foreground',
                    )}
                >
                    {status.label}
                </Link>
            ))}
        </nav>
    );
}
