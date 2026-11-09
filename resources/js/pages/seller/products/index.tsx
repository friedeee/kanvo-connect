import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { ProductImage } from '@/components/product-card';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatXof } from '@/lib/format';
import { show as preview } from '@/routes/catalog';
import { create, edit, index, stock } from '@/routes/seller/products';

type Row = {
    id: number;
    name: string;
    slug: string;
    price_xof: number;
    stock_quantity: number;
    lead_time_days: number | null;
    status: string;
    status_label: string;
    status_reason: string | null;
    image_url: string | null;
};

export default function SellerProducts({ products }: { products: Row[] }) {
    return (
        <>
            <Head title="Mes produits" />
            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Heading
                        title="Mes produits"
                        description="Le stock se met à jour sans nouvelle validation. Toute autre modification d’un produit publié le renvoie en validation."
                    />
                    <Button asChild>
                        <Link href={create()}>Ajouter un produit</Link>
                    </Button>
                </div>

                {products.length === 0 && (
                    <p className="rounded-xl border p-8 text-center text-muted-foreground">
                        Vous n’avez pas encore de produit.
                    </p>
                )}

                <ul className="divide-y rounded-xl border">
                    {products.map((product) => (
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
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Link
                                        href={edit(product.id)}
                                        className="font-medium hover:underline"
                                    >
                                        {product.name}
                                    </Link>
                                    <StatusBadge
                                        status={product.status}
                                        label={product.status_label}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {formatXof(product.price_xof)}
                                </p>
                                {product.status_reason && (
                                    <p className="text-sm text-red-700 dark:text-red-400">
                                        Motif : {product.status_reason}
                                    </p>
                                )}
                            </div>
                            <Form
                                {...stock.form(product.id)}
                                options={{ preserveScroll: true }}
                                className="flex items-center gap-2"
                            >
                                {({ processing }) => (
                                    <>
                                        <label
                                            htmlFor={`stock-${product.id}`}
                                            className="text-sm text-muted-foreground"
                                        >
                                            Stock
                                        </label>
                                        <Input
                                            id={`stock-${product.id}`}
                                            name="stock_quantity"
                                            type="number"
                                            min={0}
                                            inputMode="numeric"
                                            defaultValue={
                                                product.stock_quantity
                                            }
                                            className="w-20"
                                        />
                                        {product.lead_time_days && (
                                            <input
                                                type="hidden"
                                                name="lead_time_days"
                                                value={product.lead_time_days}
                                            />
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={processing}
                                        >
                                            OK
                                        </Button>
                                    </>
                                )}
                            </Form>
                            <Button asChild size="sm" variant="ghost">
                                <Link href={preview(product.slug)}>Aperçu</Link>
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

SellerProducts.layout = {
    breadcrumbs: [{ title: 'Mes produits', href: index() }],
};
