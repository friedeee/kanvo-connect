<?php

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

/**
 * Levée quand une action est demandée sur un objet dont le statut ne la permet pas
 * (par exemple valider un vendeur déjà validé). Ce n'est pas une erreur serveur :
 * elle n'est pas journalisée et l'utilisateur voit un message (voir bootstrap/app.php).
 */
class InvalidStatusTransition extends ConflictHttpException
{
    public static function make(string $subject, string $from, string $action): self
    {
        return new self("Impossible de {$action} : {$subject} est au statut « {$from} ».");
    }
}
