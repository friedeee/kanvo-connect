import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { StatusBadge } from '@/components/status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/seller';
import { create, index } from '@/routes/seller/products';
import { show as sellerProfile } from '@/routes/sellers';

type Props = {
    seller: {
        shop_name: string;
        slug: string;
        status: string;
        status_label: string;
        status_reason: string | null;
    };
    productCounts: Record<string, number>;
};

const messages: Record<string, string> = {
    pending:
        'Votre demande est en cours d’examen. Vous pourrez ajouter des produits dès sa validation.',
    rejected: 'Votre demande n’a pas été acceptée.',
    suspended:
        'Votre compte vendeur est suspendu : vos produits ne sont plus visibles dans le catalogue.',
};

export default function SellerDashboard({ seller, productCounts }: Props) {
    const approved = seller.status === 'approved';
    const count = (status: string) => productCounts[status] ?? 0;

    return (
        <>
            <Head title="Espace vendeur" />
            <div className="max-w-3xl space-y-6 p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <Heading title={seller.shop_name} />
                    <StatusBadge
                        status={seller.status}
                        label={seller.status_label}
                    />
                </div>

                {!approved && (
                    <Alert>
                        <AlertTitle>{seller.status_label}</AlertTitle>
                        <AlertDescription>
                            <p>{messages[seller.status]}</p>
                            {seller.status_reason && (
                                <p>Motif : {seller.status_reason}</p>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {approved && (
                    <>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {[
                                ['Publiés', count('published')],
                                ['En validation', count('pending_review')],
                                ['Brouillons', count('draft')],
                                ['Refusés', count('rejected')],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-xl border p-4"
                                >
                                    <p className="text-2xl font-semibold">
                                        {value}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href={create()}>Ajouter un produit</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={index()}>Mes produits</Link>
                            </Button>
                            <Button asChild variant="ghost">
                                <Link href={sellerProfile(seller.slug)}>
                                    Voir ma page publique
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

SellerDashboard.layout = {
    breadcrumbs: [{ title: 'Espace vendeur', href: dashboard() }],
};
