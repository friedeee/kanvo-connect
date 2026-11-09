import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { ReasonDialog } from '@/components/reason-dialog';
import { StatusTabs } from '@/components/status-tabs';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/format';
import {
    approve,
    index,
    reactivate,
    reject,
    suspend,
} from '@/routes/admin/sellers';
import type { Option, Paginator } from '@/types/kanvo';

type Row = {
    id: number;
    shop_name: string;
    slug: string;
    craft: string;
    city: string;
    phone: string;
    bio: string;
    status: string;
    status_label: string;
    status_reason: string | null;
    products_count: number;
    applied_at: string;
    user: { name: string; email: string };
};

export default function AdminSellers({
    sellers,
    status,
    statuses,
}: {
    sellers: Paginator<Row>;
    status: string;
    statuses: Option[];
}) {
    return (
        <>
            <Head title="Vendeurs" />
            <div className="space-y-6 p-4">
                <Heading title="Vendeurs" />
                <StatusTabs
                    statuses={statuses}
                    current={status}
                    href={(value) => index({ query: { status: value } })}
                />

                {sellers.data.length === 0 && (
                    <p className="text-muted-foreground">
                        Aucun vendeur dans cette catégorie.
                    </p>
                )}

                <div className="space-y-4">
                    {sellers.data.map((seller) => (
                        <article
                            key={seller.id}
                            className="space-y-3 rounded-xl border p-4"
                        >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h2 className="font-medium">
                                    {seller.shop_name}
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Demande du{' '}
                                    {formatDateTime(seller.applied_at)}
                                </p>
                            </div>
                            <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                                <div>
                                    <dt className="inline text-muted-foreground">
                                        Activité :{' '}
                                    </dt>
                                    <dd className="inline">
                                        {seller.craft}, {seller.city}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="inline text-muted-foreground">
                                        Contact :{' '}
                                    </dt>
                                    <dd className="inline">
                                        {seller.user.name} · {seller.user.email}{' '}
                                        · {seller.phone}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="inline text-muted-foreground">
                                        Produits :{' '}
                                    </dt>
                                    <dd className="inline">
                                        {seller.products_count}
                                    </dd>
                                </div>
                            </dl>
                            <p className="text-sm whitespace-pre-line">
                                {seller.bio}
                            </p>
                            {seller.status_reason && (
                                <p className="text-sm text-red-700 dark:text-red-400">
                                    Motif : {seller.status_reason}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {seller.status === 'pending' && (
                                    <>
                                        <Form
                                            {...approve.form(seller.id)}
                                            options={{ preserveScroll: true }}
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    size="sm"
                                                    disabled={processing}
                                                >
                                                    Valider
                                                </Button>
                                            )}
                                        </Form>
                                        <ReasonDialog
                                            trigger={
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    Refuser
                                                </Button>
                                            }
                                            title={`Refuser ${seller.shop_name}`}
                                            description="Le motif sera communiqué au demandeur."
                                            confirmLabel="Refuser"
                                            form={reject.form(seller.id)}
                                        />
                                    </>
                                )}
                                {seller.status === 'approved' && (
                                    <ReasonDialog
                                        trigger={
                                            <Button size="sm" variant="outline">
                                                Suspendre
                                            </Button>
                                        }
                                        title={`Suspendre ${seller.shop_name}`}
                                        description="Ses produits seront immédiatement retirés du catalogue public."
                                        confirmLabel="Suspendre"
                                        form={suspend.form(seller.id)}
                                    />
                                )}
                                {seller.status === 'suspended' && (
                                    <Form
                                        {...reactivate.form(seller.id)}
                                        options={{ preserveScroll: true }}
                                    >
                                        {({ processing }) => (
                                            <Button
                                                size="sm"
                                                disabled={processing}
                                            >
                                                Réactiver
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                <Pagination links={sellers.links} />
            </div>
        </>
    );
}

AdminSellers.layout = {
    breadcrumbs: [{ title: 'Vendeurs', href: index() }],
};
