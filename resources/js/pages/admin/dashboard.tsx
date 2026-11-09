import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { dashboard } from '@/routes/admin';
import { index as products } from '@/routes/admin/products';
import { index as sellers } from '@/routes/admin/sellers';

type Count = { status: string; label: string; total: number };

export default function AdminDashboard({
    sellers: sellerCounts,
    products: productCounts,
}: {
    sellers: Count[];
    products: Count[];
}) {
    const blocks = [
        { title: 'Vendeurs', counts: sellerCounts, href: sellers },
        { title: 'Produits', counts: productCounts, href: products },
    ];

    return (
        <>
            <Head title="Administration" />
            <div className="space-y-8 p-4">
                <Heading
                    title="Administration"
                    description="Les commandes et les transactions apparaîtront ici après l’intégration du paiement."
                />
                {blocks.map((block) => (
                    <section key={block.title} className="space-y-3">
                        <h2 className="font-medium">{block.title}</h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                            {block.counts.map((count) => (
                                <Link
                                    key={count.status}
                                    href={block.href({
                                        query: { status: count.status },
                                    })}
                                    className="rounded-xl border p-4 hover:bg-accent"
                                >
                                    <p className="text-2xl font-semibold">
                                        {count.total}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {count.label}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Administration', href: dashboard() }],
};
