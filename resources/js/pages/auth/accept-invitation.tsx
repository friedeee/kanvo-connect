import { Form, Head, Link } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, login } from '@/routes';

type Props = {
    isValid: boolean;
    sellerName: string;
    email: string;
    action: string;
    passwordRules: string;
};

/**
 * Le vendeur invité par l'admin choisit ici son mot de passe (lien reçu par e-mail).
 */
export default function AcceptInvitation({
    isValid,
    sellerName,
    email,
    action,
    passwordRules,
}: Props) {
    if (!isValid) {
        return (
            <>
                <Head title="Invitation expirée" />
                <div className="space-y-6">
                    <div className="flex gap-4 rounded-2xl border border-dashed bg-card p-5">
                        <Clock
                            className="mt-0.5 size-5 shrink-0 text-gold-foreground"
                            aria-hidden
                        />
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Ce lien a expiré ou a déjà servi. Si vous avez déjà
                            choisi votre mot de passe, connectez-vous. Sinon,
                            demandez un nouveau lien à l’équipe Kanvô.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild>
                            <Link href={login()}>Se connecter</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={home()}>Retour au site</Link>
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Activer mon compte vendeur" />

            <p className="mb-8 text-muted-foreground">
                Bienvenue {sellerName} ! Votre boutique est prête : choisissez
                votre mot de passe pour y accéder.
            </p>

            <Form
                action={action}
                method="post"
                resetOnError={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Adresse e-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="username"
                                value={email}
                                readOnly
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                required
                                placeholder="Votre mot de passe"
                                passwordrules={passwordRules}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirmer le mot de passe
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                required
                                placeholder="Retapez le mot de passe"
                                passwordrules={passwordRules}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Activer mon compte
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

AcceptInvitation.layout = {
    title: 'Votre boutique Kanvô',
};
