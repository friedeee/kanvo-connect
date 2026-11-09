import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const tones: Record<string, string> = {
    approved:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    published:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    pending:
        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
    pending_review:
        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
    withdrawn: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
};

export function StatusBadge({
    status,
    label,
}: {
    status: string;
    label: string;
}) {
    return (
        <Badge
            variant="secondary"
            className={cn('border-transparent', tones[status])}
        >
            {label}
        </Badge>
    );
}
