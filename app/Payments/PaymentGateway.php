<?php

namespace App\Payments;

/**
 * Contrat commun aux prestataires de paiement (PayDunya, CinetPay, ...).
 *
 * Aucune implémentation réelle n'existe encore : le cahier des charges (§ 4.5, § 14)
 * interdit de concevoir l'intégration avant la confirmation écrite du prestataire.
 *
 * Règle d'usage : une notification reçue du prestataire n'est qu'un signal. Le statut
 * d'un paiement est toujours relu avec fetchTransaction() avant toute écriture (RM-05).
 */
interface PaymentGateway
{
    /**
     * Crée la transaction chez le prestataire et renvoie l'adresse où diriger le client.
     */
    public function createCheckout(CheckoutRequest $request): CheckoutSession;

    /**
     * Relit, côté serveur, l'état d'une transaction à partir de notre référence.
     */
    public function fetchTransaction(string $reference): TransactionStatus;
}
