import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { selectClassName, textareaClassName } from '@/lib/format';
import { apply } from '@/routes/seller';
import { store } from '@/routes/seller/apply';
import type { Option } from '@/types/kanvo';

export default function Apply({ crafts }: { crafts: Option[] }) {
    return (
        <>
            <Head title="Devenir vendeur" />
            <div className="max-w-xl space-y-6 p-4">
                <Heading
                    title="Devenir vendeur"
                    description="Présentez votre activité. L’équipe Kanvô examine chaque demande avant d’autoriser la publication de produits."
                />

                <Form {...store.form()} className="space-y-5">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="shop_name">
                                    Nom de l’atelier ou de la marque
                                </Label>
                                <Input
                                    id="shop_name"
                                    name="shop_name"
                                    required
                                    maxLength={120}
                                />
                                <InputError message={errors.shop_name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="craft">Activité</Label>
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
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="city">Ville</Label>
                                    <Input id="city" name="city" required />
                                    <InputError message={errors.city} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        autoComplete="tel"
                                        placeholder="+229 01 …"
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bio">
                                    Présentation de votre activité
                                </Label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    required
                                    minLength={30}
                                    maxLength={3000}
                                    className={textareaClassName}
                                    placeholder="Votre savoir-faire, vos techniques, depuis quand vous travaillez…"
                                />
                                <InputError message={errors.bio} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Votre téléphone n’est pas affiché publiquement.
                                Il sert à l’équipe Kanvô pour vérifier votre
                                demande.
                            </p>
                            <Button disabled={processing}>
                                Envoyer ma demande
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Apply.layout = {
    breadcrumbs: [{ title: 'Devenir vendeur', href: apply() }],
};
