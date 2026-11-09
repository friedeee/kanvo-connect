import { Form } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { textareaClassName } from '@/lib/format';

type FormTarget = { action: string; method: 'post' };

/**
 * Action d'administration qui exige un motif écrit (refus, suspension, retrait).
 * Le motif est historisé et montré au vendeur.
 */
export function ReasonDialog({
    trigger,
    title,
    description,
    confirmLabel,
    form,
}: {
    trigger: ReactNode;
    title: string;
    description: string;
    confirmLabel: string;
    form: FormTarget;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
                <Form
                    {...form}
                    options={{ preserveScroll: true }}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="reason">Motif</Label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    required
                                    minLength={5}
                                    className={textareaClassName}
                                />
                                <InputError message={errors.reason} />
                            </div>
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Annuler
                                    </Button>
                                </DialogClose>
                                <Button
                                    variant="destructive"
                                    disabled={processing}
                                >
                                    {confirmLabel}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
