import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { ProductImage } from '@/components/product-card';
import { ReasonDialog } from '@/components/reason-dialog';
import { StatusTabs } from '@/components/status-tabs';
import { Button } from '@/components/ui/button';
import { formatXof } from '@/lib/format';
import { index, publish, reject, withdraw } from '@/routes/admin/products';
import { show as preview } from '@/routes/catalog';
import type { Option, Paginator } from '@/types/kanvo';

type Row = {
    id: number;
    name: string;
    slug: string;
    price_xof: number;
    category: string;
    status: string;
    status_label: string;
    status_reason: string | null;
    image_url: string | null;
    images_count: number;
    seller: { shop_name: string; is_approved: boolean };
};

export default function AdminProducts({
    products,
    status,
    statuses,
}: {
    products: Paginator<Row>;
    status: string;
    statuses: Option[];
}) {
    return (
        <>
            <Head title="Produits" />
            <div className="space-y-6 p-4">
                <Heading title="Produits" />
                <StatusTabs
                    statuses={statuses}
                    current={status}
                    href={(value) => index({ query: { status: value } })}
                />

                {products.data.length === 0 && (
                    <p className="text-muted-foreground">
                        Aucun produit dans cette catégorie.
                    </p>
                )}

                <ul className="divide-y rounded-xl border">
                    {products.data.map((product) => (
                        <li
                            key={product.id}
                            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                        >
                            <div className="size-16 shrink-0 overflow-hidden rounded-md border">
                                <ProductImage
                                    src={product.image_url}
                                    alt={product.name}
                                />
                            </div>
                            <div className="min-w-0 flex-1 text-sm">
                                <Link
                                    href={preview(product.slug)}
                                    className="font-medium hover:underline"
                                >
                                    {product.name}
                                </Link>
                                <p className="text-muted-foreground">
                                    {product.seller.shop_name}
                                    {!product.seller.is_approved &&
                                        ' (vendeur non validé)'}{' '}
                                    · {product.category} ·{' '}
                                    {formatXof(product.price_xof)} ·{' '}
                                    {product.images_count} photo
                                    {product.images_count > 1 ? 's' : ''}
                                </p>
                                {product.status_reason && (
                                    <p className="text-red-700 dark:text-red-400">
                                        Motif : {product.status_reason}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['pending_review', 'withdrawn'].includes(
                                    product.status,
                                ) && (
                                    <Form
                                        {...publish.form(product.id)}
                                        options={{ preserveScroll: true }}
                                    >
                                        {({ processing }) => (
                                            <Button
                                                size="sm"
                                                disabled={processing}
                                            >
                                                Publier
                                            </Button>
                                        )}
                                    </Form>
                                )}
                                {product.status === 'pending_review' && (
                                    <ReasonDialog
                                        trigger={
                                            <Button size="sm" variant="outline">
                                                Refuser
                                            </Button>
                                        }
                                        title={`Refuser « ${product.name} »`}
                                        description="Le motif sera affiché au vendeur pour qu’il corrige son produit."
                                        confirmLabel="Refuser"
                                        form={reject.form(product.id)}
                                    />
                                )}
                                {['published', 'pending_review'].includes(
                                    product.status,
                                ) && (
                                    <ReasonDialog
                                        trigger={
                                            <Button size="sm" variant="ghost">
                                                Retirer
                                            </Button>
                                        }
                                        title={`Retirer « ${product.name} »`}
                                        description="Le produit disparaît du catalogue. Le vendeur ne pourra pas le republier lui-même."
                                        confirmLabel="Retirer"
                                        form={withdraw.form(product.id)}
                                    />
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                <Pagination links={products.links} />
            </div>
        </>
    );
}

AdminProducts.layout = {
    breadcrumbs: [{ title: 'Produits', href: index() }],
};
