import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { index as catalog } from '@/routes/catalog';
import { apply } from '@/routes/seller';

export default function Dashboard() {
    return (
        <>
            <Head title="Mon espace" />
            <div className="max-w-2xl space-y-8 p-4">
                <Heading
                    title="Mon espace"
                    description="Le suivi de vos commandes arrivera avec l’ouverture de la vente en ligne."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border p-4">
                        <h2 className="font-medium">Parcourir le catalogue</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pagnes tissés et créations des artisans.
                        </p>
                        <Button asChild className="mt-4" variant="outline">
                            <Link href={catalog()}>Voir le catalogue</Link>
                        </Button>
                    </div>
                    <div className="rounded-xl border p-4">
                        <h2 className="font-medium">Vous êtes artisan ?</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Tisserands, ateliers, stylistes et couturiers
                            peuvent demander à vendre sur Kanvô.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href={apply()}>Devenir vendeur</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Mon espace', href: dashboard() }],
};
