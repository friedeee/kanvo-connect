import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { formatDateTime } from '@/lib/format';
import { auditLog } from '@/routes/admin';
import type { Paginator } from '@/types/kanvo';

type Log = {
    id: number;
    action: string;
    subject: string | null;
    properties: Record<string, string> | null;
    actor: { name: string; email: string } | null;
    created_at: string;
};

const actions: Record<string, string> = {
    'seller.applied': 'Demande vendeur',
    'seller.approved': 'Vendeur validé',
    'seller.rejected': 'Vendeur refusé',
    'seller.suspended': 'Vendeur suspendu',
    'seller.reactivated': 'Vendeur réactivé',
    'product.submitted': 'Produit soumis',
    'product.resubmitted_after_edit': 'Produit modifié, renvoyé en validation',
    'product.published': 'Produit publié',
    'product.rejected': 'Produit refusé',
    'product.withdrawn': 'Produit retiré',
    'product.disabled': 'Produit désactivé par le vendeur',
    'category.created': 'Catégorie créée',
    'category.updated': 'Catégorie modifiée',
    'category.deleted': 'Catégorie supprimée',
};

export default function AuditLog({ logs }: { logs: Paginator<Log> }) {
    return (
        <>
            <Head title="Journal" />
            <div className="space-y-6 p-4">
                <Heading
                    title="Journal des actions"
                    description="Historique des actions sensibles. Les entrées ne peuvent pas être modifiées."
                />
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-2 font-medium">Date</th>
                                <th className="px-4 py-2 font-medium">
                                    Action
                                </th>
                                <th className="px-4 py-2 font-medium">Objet</th>
                                <th className="px-4 py-2 font-medium">
                                    Auteur
                                </th>
                                <th className="px-4 py-2 font-medium">
                                    Détail
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {logs.data.map((log) => (
                                <tr key={log.id}>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {formatDateTime(log.created_at)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {actions[log.action] ?? log.action}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {log.subject}
                                    </td>
                                    <td className="px-4 py-2">
                                        {log.actor?.name ?? 'Système'}
                                    </td>
                                    <td className="px-4 py-2 text-muted-foreground">
                                        {log.properties?.reason ??
                                            (log.properties?.from &&
                                                `${log.properties.from} → ${log.properties.to}`)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={logs.links} />
            </div>
        </>
    );
}

AuditLog.layout = {
    breadcrumbs: [{ title: 'Journal', href: auditLog() }],
};
