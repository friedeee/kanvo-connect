<?php

namespace App\Payments;

use InvalidArgumentException;

final readonly class CheckoutRequest
{
    /**
     * @param  string  $reference  Référence unique côté Kanvô, réutilisée pour l'idempotence (RM-06).
     * @param  int  $amountXof  Montant entier en FCFA.
     */
    public function __construct(
        public string $reference,
        public int $amountXof,
        public string $description,
        public string $returnUrl,
        public string $notifyUrl,
    ) {
        if ($amountXof <= 0) {
            throw new InvalidArgumentException('Le montant doit être strictement positif.');
        }
    }
}
