import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Eye,
    ImagePlus,
    PackageCheck,
    Send,
    Trash2,
    Undo2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, FormEvent, ReactNode } from 'react';
import InputError from '@/components/input-error';
import { ProductImage } from '@/components/product-card';
import { StatusBadge } from '@/components/status-badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { colorHex } from '@/components/woven-pattern';
import { formatXof, selectClassName, textareaClassName } from '@/lib/format';
import { cn } from '@/lib/utils';
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

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

/** Valeurs lues dans le formulaire pour l'aperçu en direct. */
type Draft = {
    name: string;
    price: number;
    saleUnit: string;
    colors: string[];
    stock: number;
    leadTime: number;
};

function readDraft(form: HTMLFormElement): Draft {
    const data = new FormData(form);
    const text = (key: string) => {
        const value = data.get(key);

        return typeof value === 'string' ? value : '';
    };

    return {
        name: text('name'),
        price: Number(text('price_xof')),
        saleUnit: text('sale_unit'),
        colors: data
            .getAll('colors[]')
            .filter((value): value is string => typeof value === 'string'),
        stock: Number(text('stock_quantity')),
        leadTime: Number(text('lead_time_days')),
    };
}

export default function ProductForm({
    product,
    categories,
    colors,
    saleUnits,
    maxImages,
}: Props) {
    const target = product ? update.form(product.id) : store.form();
    const title = product ? product.name : 'Nouvelle pièce';

    const [draft, setDraft] = useState<Draft>({
        name: product?.name ?? '',
        price: product?.price_xof ?? 0,
        saleUnit: product?.sale_unit ?? 'pagne',
        colors: product?.colors ?? [],
        stock: product?.stock_quantity ?? 0,
        leadTime: product?.lead_time_days ?? 0,
    });
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [removed, setRemoved] = useState<number[]>([]);
    const [dragging, setDragging] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    const newPreviews = useMemo(
        () => newFiles.map((file) => URL.createObjectURL(file)),
        [newFiles],
    );
    useEffect(
        () => () => newPreviews.forEach((url) => URL.revokeObjectURL(url)),
        [newPreviews],
    );

    /* Le champ fichier reflète toujours la liste affichée (ajouts, retraits). */
    useEffect(() => {
        if (!fileInput.current || typeof DataTransfer === 'undefined') {
            return;
        }

        const transfer = new DataTransfer();
        newFiles.forEach((file) => transfer.items.add(file));
        fileInput.current.files = transfer.files;
    }, [newFiles]);

    const keptImages = (product?.images ?? []).filter(
        (image) => !removed.includes(image.id),
    );
    const remainingSlots = Math.max(
        0,
        maxImages - keptImages.length - newFiles.length,
    );
    const coverUrl = keptImages[0]?.url ?? newPreviews[0] ?? null;
    const saleUnitLabel =
        saleUnits.find((unit) => unit.value === draft.saleUnit)?.label ?? '';

    const addFiles = (files: FileList | File[]) => {
        const accepted = Array.from(files).filter((file) =>
            ACCEPTED.includes(file.type),
        );
        setNewFiles((current) =>
            [...current, ...accepted].slice(0, maxImages - keptImages.length),
        );
    };

    const onDrop = (event: DragEvent) => {
        event.preventDefault();
        setDragging(false);
        addFiles(event.dataTransfer.files);
    };

    const onFormChange = (event: FormEvent<HTMLDivElement>) => {
        const form = (event.target as HTMLInputElement).form;

        if (form) {
            setDraft(readDraft(form));
        }
    };

    return (
        <>
            <Head title={title} />
            <div className="space-y-6 p-4 lg:p-6">
                <Link
                    href={index()}
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft
                        className="size-4 transition group-hover:-translate-x-1"
                        aria-hidden
                    />
                    Mes produits
                </Link>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
                            {title}
                        </h1>
                        {product && (
                            <StatusBadge
                                status={product.status}
                                label={product.status_label}
                            />
                        )}
                    </div>
                    {product && (
                        <div className="flex flex-wrap gap-2">
                            {product.can_submit && (
                                <Form {...submit.form(product.id)}>
                                    {({ processing, errors }) => (
                                        <>
                                            <Button
                                                disabled={processing}
                                                className="rounded-full"
                                            >
                                                <Send aria-hidden />
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
                                            className="rounded-full"
                                        >
                                            Mettre hors ligne
                                        </Button>
                                    )}
                                </Form>
                            )}
                            <Button
                                asChild
                                variant="ghost"
                                className="rounded-full"
                            >
                                <Link href={preview(product.slug)}>
                                    <Eye aria-hidden />
                                    Aperçu
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {product?.status_reason && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            Motif : {product.status_reason}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    <div onChange={onFormChange}>
                        <Form
                            {...target}
                            options={{ preserveScroll: true }}
                            resetOnSuccess={['images', 'remove_image_ids']}
                            onSuccess={() => {
                                setNewFiles([]);
                                setRemoved([]);
                            }}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* ========== 1. Photos ========== */}
                                    <Step
                                        number={1}
                                        title="Photos"
                                        hint={`Jusqu’à ${maxImages} photos. La première sert de couverture.`}
                                    >
                                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                            {product?.images.map((image, i) => {
                                                const isRemoved =
                                                    removed.includes(image.id);

                                                return (
                                                    <label
                                                        key={image.id}
                                                        className="group/photo relative aspect-square cursor-pointer overflow-hidden rounded-2xl ring-1 ring-border"
                                                    >
                                                        <img
                                                            src={image.url}
                                                            alt=""
                                                            className={cn(
                                                                'h-full w-full object-cover transition',
                                                                isRemoved &&
                                                                    'scale-95 opacity-30 grayscale',
                                                            )}
                                                        />
                                                        <input
                                                            type="checkbox"
                                                            name="remove_image_ids[]"
                                                            value={image.id}
                                                            checked={isRemoved}
                                                            onChange={(
                                                                e: ChangeEvent<HTMLInputElement>,
                                                            ) =>
                                                                setRemoved(
                                                                    (
                                                                        current,
                                                                    ) =>
                                                                        e.target
                                                                            .checked
                                                                            ? [
                                                                                  ...current,
                                                                                  image.id,
                                                                              ]
                                                                            : current.filter(
                                                                                  (
                                                                                      id,
                                                                                  ) =>
                                                                                      id !==
                                                                                      image.id,
                                                                              ),
                                                                )
                                                            }
                                                            className="sr-only"
                                                        />
                                                        <span
                                                            className={cn(
                                                                'absolute top-2 right-2 grid size-8 place-items-center rounded-full shadow transition',
                                                                isRemoved
                                                                    ? 'bg-background text-foreground'
                                                                    : 'bg-black/60 text-white opacity-100 sm:opacity-0 sm:group-hover/photo:opacity-100',
                                                            )}
                                                            title={
                                                                isRemoved
                                                                    ? 'Garder la photo'
                                                                    : 'Supprimer la photo'
                                                            }
                                                        >
                                                            {isRemoved ? (
                                                                <Undo2
                                                                    className="size-4"
                                                                    aria-hidden
                                                                />
                                                            ) : (
                                                                <Trash2
                                                                    className="size-4"
                                                                    aria-hidden
                                                                />
                                                            )}
                                                        </span>
                                                        <span className="sr-only">
                                                            {isRemoved
                                                                ? 'Garder la photo'
                                                                : 'Supprimer la photo'}
                                                        </span>
                                                        {i === 0 &&
                                                            !isRemoved && (
                                                                <span className="absolute bottom-2 left-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-ink">
                                                                    Couverture
                                                                </span>
                                                            )}
                                                    </label>
                                                );
                                            })}
                                            {newPreviews.map((url, i) => (
                                                <div
                                                    key={url}
                                                    className="relative aspect-square animate-rise overflow-hidden rounded-2xl ring-2 ring-primary/40"
                                                >
                                                    <img
                                                        src={url}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setNewFiles(
                                                                (current) =>
                                                                    current.filter(
                                                                        (
                                                                            _,
                                                                            j,
                                                                        ) =>
                                                                            j !==
                                                                            i,
                                                                    ),
                                                            )
                                                        }
                                                        className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/60 text-white shadow transition hover:bg-black/80"
                                                        aria-label="Retirer cette photo"
                                                    >
                                                        <X
                                                            className="size-4"
                                                            aria-hidden
                                                        />
                                                    </button>
                                                    <span className="absolute bottom-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                                        Nouvelle
                                                    </span>
                                                </div>
                                            ))}
                                            {remainingSlots > 0 && (
                                                <label
                                                    htmlFor="product-images"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === 'Enter' ||
                                                            e.key === ' '
                                                        ) {
                                                            e.preventDefault();
                                                            fileInput.current?.click();
                                                        }
                                                    }}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        setDragging(true);
                                                    }}
                                                    onDragLeave={() =>
                                                        setDragging(false)
                                                    }
                                                    onDrop={onDrop}
                                                    className={cn(
                                                        'grid aspect-square cursor-pointer place-items-center rounded-2xl border-2 border-dashed p-3 text-center text-xs text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary',
                                                        dragging &&
                                                            'scale-105 border-primary bg-primary/10 text-primary',
                                                    )}
                                                >
                                                    <span className="grid place-items-center gap-1.5">
                                                        <ImagePlus
                                                            className="size-7"
                                                            aria-hidden
                                                        />
                                                        Ajouter
                                                        <span className="hidden sm:block">
                                                            ou glisser ici
                                                        </span>
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                        {/* Toujours présent : il porte les nouvelles photos à l'envoi. */}
                                        <input
                                            ref={fileInput}
                                            id="product-images"
                                            type="file"
                                            name="images[]"
                                            multiple
                                            accept={ACCEPTED.join(',')}
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    addFiles(e.target.files);
                                                }
                                            }}
                                            className="sr-only"
                                            tabIndex={-1}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            JPG, PNG ou WebP, 5 Mo au maximum
                                            par photo. Lumière du jour, pièce
                                            entière et détail du motif.
                                        </p>
                                        <InputError
                                            message={
                                                errors.images ??
                                                Object.entries(errors).find(
                                                    ([key]) =>
                                                        key.startsWith(
                                                            'images.',
                                                        ),
                                                )?.[1]
                                            }
                                        />
                                    </Step>

                                    {/* ========== 2. Description ========== */}
                                    <Step
                                        number={2}
                                        title="Description"
                                        hint="Ce que le client verra sur la fiche de la pièce."
                                    >
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2 sm:col-span-2">
                                                <Label htmlFor="name">
                                                    Nom de la pièce
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    maxLength={150}
                                                    defaultValue={product?.name}
                                                    placeholder="Pagne kanvô indigo et or"
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>
                                            <div className="grid gap-2 sm:col-span-2">
                                                <Label htmlFor="category_id">
                                                    Catégorie
                                                </Label>
                                                <select
                                                    id="category_id"
                                                    name="category_id"
                                                    required
                                                    defaultValue={
                                                        product?.category_id ??
                                                        ''
                                                    }
                                                    className={selectClassName}
                                                >
                                                    <option value="" disabled>
                                                        Choisir…
                                                    </option>
                                                    {categories.map(
                                                        (category) => (
                                                            <option
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.id
                                                                }
                                                            >
                                                                {category.name}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                                <InputError
                                                    message={errors.category_id}
                                                />
                                            </div>
                                            <div className="grid gap-2 sm:col-span-2">
                                                <Label htmlFor="description">
                                                    Description
                                                </Label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    required
                                                    minLength={20}
                                                    defaultValue={
                                                        product?.description
                                                    }
                                                    className={
                                                        textareaClassName
                                                    }
                                                    placeholder="Motif, technique, occasion où le porter…"
                                                />
                                                <InputError
                                                    message={errors.description}
                                                />
                                            </div>
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
                                                            className="flex cursor-pointer items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm transition hover:border-primary/50 has-checked:border-primary has-checked:bg-primary/10 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                name="colors[]"
                                                                value={value}
                                                                defaultChecked={product?.colors.includes(
                                                                    value,
                                                                )}
                                                                className="sr-only"
                                                            />
                                                            <span
                                                                className="size-6 rounded-full ring-1 ring-black/10"
                                                                style={{
                                                                    background:
                                                                        colorHex(
                                                                            label,
                                                                        ) ??
                                                                        'conic-gradient(#26306b, #c9a03a, #b8322a, #2f6b45, #26306b)',
                                                                }}
                                                                aria-hidden
                                                            />
                                                            {label}
                                                        </label>
                                                    ),
                                                )}
                                            </div>
                                            <InputError
                                                message={
                                                    errors.colors ??
                                                    errors['colors.0']
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
                                                <InputError
                                                    message={errors.width_cm}
                                                />
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
                                                Conseils d’entretien{' '}
                                                <span className="font-normal text-muted-foreground">
                                                    (facultatif)
                                                </span>
                                            </Label>
                                            <textarea
                                                id="care_instructions"
                                                name="care_instructions"
                                                defaultValue={
                                                    product?.care_instructions ??
                                                    ''
                                                }
                                                className={textareaClassName}
                                                placeholder="Lavage à la main, à l’eau froide…"
                                            />
                                            <InputError
                                                message={
                                                    errors.care_instructions
                                                }
                                            />
                                        </div>
                                    </Step>

                                    {/* ========== 3. Prix et stock ========== */}
                                    <Step
                                        number={3}
                                        title="Prix et disponibilité"
                                        hint="Le stock pourra être ajusté à tout moment depuis « Mes produits »."
                                    >
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
                                                    defaultValue={
                                                        product?.price_xof
                                                    }
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
                                                        product?.sale_unit ??
                                                        'pagne'
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
                                                        product?.stock_quantity ??
                                                        0
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.stock_quantity
                                                    }
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
                                                        product?.lead_time_days ??
                                                        ''
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.lead_time_days
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </Step>

                                    <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t bg-background/90 px-4 py-4 backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
                                        <Button
                                            disabled={processing}
                                            size="lg"
                                            className="rounded-full"
                                        >
                                            {processing && <Spinner />}
                                            {product
                                                ? 'Enregistrer'
                                                : 'Créer la pièce'}
                                        </Button>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="rounded-full"
                                        >
                                            <Link href={index()}>Annuler</Link>
                                        </Button>
                                        {!product && (
                                            <p className="text-xs text-muted-foreground">
                                                Elle sera enregistrée en
                                                brouillon : vous la soumettrez
                                                ensuite à validation.
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* ========== Aperçu en direct ========== */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-6 space-y-3">
                            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                Aperçu client
                            </p>
                            <div className="rounded-3xl border bg-card p-4 shadow-xl shadow-primary/5">
                                <div className="aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-border">
                                    <ProductImage
                                        key={coverUrl ?? 'motif'}
                                        src={coverUrl}
                                        alt=""
                                        seed={product?.slug ?? 'nouvelle-piece'}
                                        colors={draft.colors.map(
                                            (value) => colors[value] ?? value,
                                        )}
                                        badge={!coverUrl}
                                        className="animate-rise"
                                    />
                                </div>
                                <p className="mt-3 line-clamp-2 font-display text-lg leading-snug">
                                    {draft.name || 'Nom de la pièce'}
                                </p>
                                <p className="mt-1 flex items-baseline gap-1.5">
                                    <span className="font-semibold">
                                        {draft.price > 0
                                            ? formatXof(draft.price)
                                            : '— FCFA'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {saleUnitLabel.toLowerCase()}
                                    </span>
                                </p>
                                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                                    {draft.leadTime > 0 ? (
                                        <>
                                            <Clock
                                                className="size-3.5"
                                                aria-hidden
                                            />
                                            Fabriqué à la commande (
                                            {draft.leadTime} j)
                                        </>
                                    ) : (
                                        <>
                                            <PackageCheck
                                                className="size-3.5"
                                                aria-hidden
                                            />
                                            {draft.stock > 0
                                                ? `${draft.stock} en stock`
                                                : 'Épuisé'}
                                        </>
                                    )}
                                </p>
                                {draft.colors.length > 0 && (
                                    <div className="mt-3 flex gap-1.5">
                                        {draft.colors.map((value) => (
                                            <span
                                                key={value}
                                                title={colors[value]}
                                                className="size-5 rounded-full ring-1 ring-black/10"
                                                style={{
                                                    background:
                                                        colorHex(
                                                            colors[value] ??
                                                                value,
                                                        ) ??
                                                        'conic-gradient(#26306b, #c9a03a, #b8322a, #2f6b45, #26306b)',
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                {keptImages.length + newFiles.length} photo
                                {keptImages.length + newFiles.length > 1
                                    ? 's'
                                    : ''}{' '}
                                · l’aperçu se met à jour pendant que vous
                                remplissez le formulaire.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}

function Step({
    number,
    title,
    hint,
    children,
}: {
    number: number;
    title: string;
    hint: string;
    children: ReactNode;
}) {
    return (
        <section className="animate-rise space-y-5 rounded-3xl border bg-card p-5 sm:p-6">
            <header className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-display text-primary-foreground">
                    {number}
                </span>
                <div>
                    <h2 className="font-display text-xl">{title}</h2>
                    <p className="text-sm text-muted-foreground">{hint}</p>
                </div>
            </header>
            {children}
        </section>
    );
}

ProductForm.layout = {
    breadcrumbs: [{ title: 'Mes produits', href: index() }],
};
