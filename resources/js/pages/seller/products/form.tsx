import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { StatusBadge } from '@/components/status-badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { selectClassName, textareaClassName } from '@/lib/format';
import { show as preview } from '@/routes/catalog';
import {
    disable,
    index,
    store,
    submit,
    update,
} from '@/routes/seller/products';
import type { CategoryOption, Option } from '@/types/kanvo';

type EditableProduct = {
    id: number;
    slug: string;
    category_id: number;
    name: string;
    description: string;
    price_xof: number;
    sale_unit: string;
    stock_quantity: number;
    lead_time_days: number | null;
    length_cm: number | null;
    width_cm: number | null;
    colors: string[];
    materials: string | null;
    care_instructions: string | null;
    status: string;
    status_label: string;
    status_reason: string | null;
    can_submit: boolean;
    images: { id: number; url: string }[];
};

type Props = {
    product: EditableProduct | null;
    categories: CategoryOption[];
    colors: Record<string, string>;
    saleUnits: Option[];
    maxImages: number;
};

export default function ProductForm({
    product,
    categories,
    colors,
    saleUnits,
    maxImages,
}: Props) {
    const target = product ? update.form(product.id) : store.form();
    const title = product ? product.name : 'Nouveau produit';

    return (
        <>
            <Head title={title} />
            <div className="max-w-3xl space-y-6 p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <Heading title={title} />
                    {product && (
                        <StatusBadge
                            status={product.status}
                            label={product.status_label}
                        />
                    )}
                </div>

                {product?.status_reason && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            Motif : {product.status_reason}
                        </AlertDescription>
                    </Alert>
                )}

                {product && (
                    <div className="flex flex-wrap gap-2">
                        {product.can_submit && (
                            <Form {...submit.form(product.id)}>
                                {({ processing, errors }) => (
                                    <>
                                        <Button disabled={processing}>
                                            Soumettre à validation
                                        </Button>
                                        <InputError
                                            className="mt-2"
                                            message={errors.images}
                                        />
                                    </>
                                )}
                            </Form>
                        )}
                        {['published', 'pending_review'].includes(
                            product.status,
                        ) && (
                            <Form {...disable.form(product.id)}>
                                {({ processing }) => (
                                    <Button
                                        variant="outline"
                                        disabled={processing}
                                    >
                                        Désactiver
                                    </Button>
                                )}
                            </Form>
                        )}
                        <Button asChild variant="ghost">
                            <Link href={preview(product.slug)}>Aperçu</Link>
                        </Button>
                    </div>
                )}

                <Form
                    {...target}
                    options={{ preserveScroll: true }}
                    resetOnSuccess={['images', 'remove_image_ids']}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <section className="space-y-4 rounded-xl border p-4">
                                <h2 className="font-medium">Description</h2>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nom</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        maxLength={150}
                                        defaultValue={product?.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">
                                        Catégorie
                                    </Label>
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        required
                                        defaultValue={
                                            product?.category_id ?? ''
                                        }
                                        className={selectClassName}
                                    >
                                        <option value="" disabled>
                                            Choisir…
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        required
                                        minLength={20}
                                        defaultValue={product?.description}
                                        className={textareaClassName}
                                    />
                                    <InputError message={errors.description} />
                                </div>
                                <fieldset className="grid gap-2">
                                    <legend className="mb-2 text-sm font-medium">
                                        Couleurs
                                    </legend>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(colors).map(
                                            ([value, label]) => (
                                                <label
                                                    key={value}
                                                    className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm has-checked:border-primary has-checked:bg-primary/10"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="colors[]"
                                                        value={value}
                                                        defaultChecked={product?.colors.includes(
                                                            value,
                                                        )}
                                                        className="size-3.5"
                                                    />
                                                    {label}
                                                </label>
                                            ),
                                        )}
                                    </div>
                                    <InputError
                                        message={
                                            errors.colors ?? errors['colors.0']
                                        }
                                    />
                                </fieldset>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="length_cm">
                                            Longueur (cm)
                                        </Label>
                                        <Input
                                            id="length_cm"
                                            name="length_cm"
                                            type="number"
                                            min={1}
                                            inputMode="numeric"
                                            defaultValue={
                                                product?.length_cm ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.length_cm}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="width_cm">
                                            Largeur (cm)
                                        </Label>
                                        <Input
                                            id="width_cm"
                                            name="width_cm"
                                            type="number"
                                            min={1}
                                            inputMode="numeric"
                                            defaultValue={
                                                product?.width_cm ?? ''
                                            }
                                        />
                                        <InputError message={errors.width_cm} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="materials">
                                            Matières
                                        </Label>
                                        <Input
                                            id="materials"
                                            name="materials"
                                            placeholder="Coton, soie…"
                                            defaultValue={
                                                product?.materials ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.materials}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="care_instructions">
                                        Conseils d’entretien
                                    </Label>
                                    <textarea
                                        id="care_instructions"
                                        name="care_instructions"
                                        defaultValue={
                                            product?.care_instructions ?? ''
                                        }
                                        className={textareaClassName}
                                    />
                                    <InputError
                                        message={errors.care_instructions}
                                    />
                                </div>
                            </section>

                            <section className="space-y-4 rounded-xl border p-4">
                                <h2 className="font-medium">
                                    Prix et disponibilité
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="price_xof">
                                            Prix (FCFA)
                                        </Label>
                                        <Input
                                            id="price_xof"
                                            name="price_xof"
                                            type="number"
                                            min={100}
                                            step={1}
                                            required
                                            inputMode="numeric"
                                            defaultValue={product?.price_xof}
                                        />
                                        <InputError
                                            message={errors.price_xof}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="sale_unit">
                                            Unité de vente
                                        </Label>
                                        <select
                                            id="sale_unit"
                                            name="sale_unit"
                                            required
                                            defaultValue={
                                                product?.sale_unit ?? 'pagne'
                                            }
                                            className={selectClassName}
                                        >
                                            {saleUnits.map((unit) => (
                                                <option
                                                    key={unit.value}
                                                    value={unit.value}
                                                >
                                                    {unit.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.sale_unit}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="stock_quantity">
                                            Quantité disponible
                                        </Label>
                                        <Input
                                            id="stock_quantity"
                                            name="stock_quantity"
                                            type="number"
                                            min={0}
                                            required
                                            inputMode="numeric"
                                            defaultValue={
                                                product?.stock_quantity ?? 0
                                            }
                                        />
                                        <InputError
                                            message={errors.stock_quantity}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lead_time_days">
                                            Délai de fabrication (jours)
                                        </Label>
                                        <Input
                                            id="lead_time_days"
                                            name="lead_time_days"
                                            type="number"
                                            min={1}
                                            inputMode="numeric"
                                            placeholder="Si fabriqué à la commande"
                                            defaultValue={
                                                product?.lead_time_days ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.lead_time_days}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4 rounded-xl border p-4">
                                <h2 className="font-medium">
                                    Photos ({maxImages} au maximum)
                                </h2>
                                {product && product.images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                        {product.images.map((image) => (
                                            <label
                                                key={image.id}
                                                className="space-y-1 text-xs"
                                            >
                                                <img
                                                    src={image.url}
                                                    alt=""
                                                    className="aspect-square w-full rounded-md border object-cover"
                                                />
                                                <span className="flex items-center gap-1">
                                                    <input
                                                        type="checkbox"
                                                        name="remove_image_ids[]"
                                                        value={image.id}
                                                    />
                                                    Supprimer
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    name="images[]"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp"
                                />
                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG ou WebP, 5 Mo au maximum par photo.
                                </p>
                                <InputError
                                    message={
                                        errors.images ??
                                        Object.entries(errors).find(([key]) =>
                                            key.startsWith('images.'),
                                        )?.[1]
                                    }
                                />
                            </section>

                            <div className="flex gap-3">
                                <Button disabled={processing}>
                                    Enregistrer
                                </Button>
                                <Button asChild variant="ghost">
                                    <Link href={index()}>Retour</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

ProductForm.layout = {
    breadcrumbs: [{ title: 'Mes produits', href: index() }],
};
