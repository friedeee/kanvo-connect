import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, MailCheck } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { selectClassName, textareaClassName } from '@/lib/format';
import { create, index, store } from '@/routes/admin/sellers';
import type { Option } from '@/types/kanvo';

/**
 * Seul l'admin crée les comptes vendeurs : le vendeur reçoit ensuite un e-mail pour choisir son mot de passe.
 */
export default function CreateSeller({ crafts }: { crafts: Option[] }) {
    return (
        <>
            <Head title="Nouveau vendeur" />
            <div className="max-w-3xl space-y-6 p-4">
                <Link
                    href={index()}
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft
                        className="size-4 transition group-hover:-translate-x-1"
                        aria-hidden
                    />
                    Retour aux vendeurs
                </Link>
                <Heading
                    title="Nouveau vendeur"
                    description="Créez le compte et la boutique de l’artisan. La boutique est validée immédiatement."
                />

                <div className="flex gap-3 rounded-xl border bg-primary/5 p-4 text-sm">
                    <MailCheck
                        className="mt-0.5 size-5 shrink-0 text-primary"
                        aria-hidden
                    />
                    <p className="text-muted-foreground">
                        Le vendeur recevra un e-mail avec un lien (valable 7
                        jours) pour choisir lui-même son mot de passe. Vous ne
                        connaîtrez jamais ce mot de passe.
                    </p>
                </div>

                <Form {...store.form()} className="space-y-8">
                    {({ processing, errors }) => (
                        <>
                            <fieldset className="space-y-4 rounded-xl border p-5">
                                <legend className="px-2 font-medium">
                                    Compte de connexion
                                </legend>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Nom de l’artisan
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            autoComplete="off"
                                            placeholder="Prénom et nom"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Adresse e-mail
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="off"
                                            placeholder="artisan@exemple.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset className="space-y-4 rounded-xl border p-5">
                                <legend className="px-2 font-medium">
                                    Boutique
                                </legend>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="shop_name">
                                            Nom de la boutique
                                        </Label>
                                        <Input
                                            id="shop_name"
                                            name="shop_name"
                                            required
                                            placeholder="Atelier Tchibozo"
                                        />
                                        <InputError
                                            message={errors.shop_name}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="craft">Métier</Label>
                                        <select
                                            id="craft"
                                            name="craft"
                                            required
                                            defaultValue=""
                                            className={selectClassName}
                                        >
                                            <option value="" disabled>
                                                Choisir…
                                            </option>
                                            {crafts.map((craft) => (
                                                <option
                                                    key={craft.value}
                                                    value={craft.value}
                                                >
                                                    {craft.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.craft} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="city">Ville</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            required
                                            placeholder="Abomey"
                                        />
                                        <InputError message={errors.city} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Téléphone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            placeholder="+229 01 …"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="bio">
                                        Présentation de l’atelier
                                    </Label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        required
                                        minLength={30}
                                        className={textareaClassName}
                                        placeholder="Savoir-faire, matières, histoire de l’atelier… (affiché sur la page publique)"
                                    />
                                    <InputError message={errors.bio} />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Le téléphone reste privé : il n’est jamais
                                    affiché sur le site.
                                </p>
                            </fieldset>

                            <Button disabled={processing}>
                                {processing && <Spinner />}
                                Créer et envoyer l’invitation
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

CreateSeller.layout = {
    breadcrumbs: [
        { title: 'Vendeurs', href: index() },
        { title: 'Nouveau vendeur', href: create() },
    ],
};
