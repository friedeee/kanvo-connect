const xof = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
});

/** Montant entier en FCFA, par exemple « 35 000 F CFA ». */
export function formatXof(amount: number): string {
    return xof.format(amount);
}

const dateTime = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

export function formatDateTime(iso: string): string {
    return dateTime.format(new Date(iso));
}

export function formatDimensions(
    length: number | null,
    width: number | null,
): string | null {
    if (length && width) {
        return `${length} × ${width} cm`;
    }

    if (length) {
        return `${length} cm de long`;
    }

    return null;
}

/** Classe commune aux listes déroulantes natives, alignée sur le composant Input. */
export const selectClassName =
    'h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-input/30';

export const textareaClassName =
    'min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-input/30';
