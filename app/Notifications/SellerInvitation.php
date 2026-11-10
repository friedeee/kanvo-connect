<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

/**
 * Invitation envoyée quand l'admin crée un compte vendeur : le lien permet de choisir son mot de passe.
 */
class SellerInvitation extends Notification
{
    use Queueable;

    public const VALID_DAYS = 7;

    public function __construct(public string $shopName) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(User $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Votre boutique Kanvô est prête')
            ->greeting("Bonjour {$notifiable->name} !")
            ->line("L’équipe Kanvô a ouvert la boutique « {$this->shopName} ». Il ne reste qu’à choisir votre mot de passe pour vous connecter et publier vos pièces.")
            ->action('Choisir mon mot de passe', self::url($notifiable))
            ->line('Ce lien est valable '.self::VALID_DAYS.' jours et ne sert qu’une fois. S’il a expiré, demandez-en un nouveau à l’équipe Kanvô.')
            ->salutation('À très vite, l’équipe Kanvô');
    }

    /**
     * Lien signé et limité dans le temps. Il contient une empreinte du mot de passe actuel :
     * dès que le vendeur a choisi le sien, le lien ne fonctionne plus.
     */
    public static function url(User $user): string
    {
        return URL::temporarySignedRoute('invitation.show', now()->addDays(self::VALID_DAYS), [
            'user' => $user->id,
            'hash' => self::passwordFingerprint($user),
        ]);
    }

    public static function passwordFingerprint(User $user): string
    {
        return sha1((string) $user->getAuthPassword());
    }
}
