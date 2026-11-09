import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { destroy, index, store, update } from '@/routes/admin/categories';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    position: number;
    products_count: number;
};

export default function AdminCategories({
    categories,
}: {
    categories: Category[];
}) {
    return (
        <>
            <Head title="Catégories" />
            <div className="max-w-3xl space-y-6 p-4">
                <Heading title="Catégories" />

                <Form
                    {...store.form()}
                    options={{ preserveScroll: true }}
                    resetOnSuccess
                    className="flex flex-wrap items-start gap-2 rounded-xl border p-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="min-w-48 flex-1">
                                <Input
                                    name="name"
                                    required
                                    placeholder="Nouvelle catégorie"
                                    aria-label="Nom de la catégorie"
                                />
                                <InputError
                                    className="mt-1"
                                    message={errors.name}
                                />
                            </div>
                            <Input
                                name="position"
                                type="number"
                                min={0}
                                placeholder="Ordre"
                                aria-label="Ordre d’affichage"
                                className="w-24"
                            />
                            <Button disabled={processing}>Ajouter</Button>
                        </>
                    )}
                </Form>

                <ul className="divide-y rounded-xl border">
                    {categories.map((category) => (
                        <li key={category.id} className="p-4">
                            <Form
                                {...update.form(category.id)}
                                options={{ preserveScroll: true }}
                                className="flex flex-wrap items-start gap-2"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="min-w-48 flex-1">
                                            <Input
                                                name="name"
                                                required
                                                defaultValue={category.name}
                                                aria-label="Nom"
                                            />
                                            <InputError
                                                className="mt-1"
                                                message={errors.name}
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {category.products_count}{' '}
                                                produit
                                                {category.products_count > 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                        </div>
                                        <Input
                                            name="position"
                                            type="number"
                                            min={0}
                                            defaultValue={category.position}
                                            aria-label="Ordre d’affichage"
                                            className="w-24"
                                        />
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={processing}
                                        >
                                            Enregistrer
                                        </Button>
                                    </>
                                )}
                            </Form>
                            {category.products_count === 0 && (
                                <Form
                                    {...destroy.form(category.id)}
                                    options={{ preserveScroll: true }}
                                    className="mt-2"
                                >
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-700 dark:text-red-400"
                                    >
                                        Supprimer
                                    </Button>
                                </Form>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

AdminCategories.layout = {
    breadcrumbs: [{ title: 'Catégories', href: index() }],
};
