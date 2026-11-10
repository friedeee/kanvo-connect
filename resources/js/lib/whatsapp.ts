/**
 * Lien wa.me vers le numéro de Kanvô, avec un message déjà rédigé.
 */
export function whatsappUrl(number: string, message: string): string {
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
