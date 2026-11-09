<?php

namespace App\Payments;

use App\Enums\PaymentStatus;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Prestataire simulé pour le développement et les tests. Refusé en production
 * (voir AppServiceProvider).
 */
class FakePaymentGateway implements PaymentGateway
{
    /** @var array<string, TransactionStatus> */
    private array $transactions = [];

    public function createCheckout(CheckoutRequest $request): CheckoutSession
    {
        // Même référence, même transaction : rejouer la demande ne crée pas de doublon.
        $existing = $this->transactions[$request->reference] ?? null;

        $transaction = $existing ?? new TransactionStatus(
            reference: $request->reference,
            providerTransactionId: 'fake_'.Str::lower(Str::random(16)),
            status: PaymentStatus::Pending,
            amountXof: $request->amountXof,
        );

        $this->transactions[$request->reference] = $transaction;

        return new CheckoutSession(
            reference: $transaction->reference,
            providerTransactionId: $transaction->providerTransactionId,
            redirectUrl: $request->returnUrl.'?fake_transaction='.$transaction->providerTransactionId,
        );
    }

    public function fetchTransaction(string $reference): TransactionStatus
    {
        return $this->transactions[$reference]
            ?? throw new RuntimeException("Transaction inconnue : {$reference}");
    }

    /**
     * Simule la décision du prestataire (paiement réussi, échoué, annulé).
     */
    public function settle(string $reference, PaymentStatus $status): void
    {
        $current = $this->fetchTransaction($reference);

        if ($current->status->isFinal()) {
            throw new RuntimeException("La transaction {$reference} est déjà finalisée.");
        }

        $this->transactions[$reference] = new TransactionStatus(
            $current->reference, $current->providerTransactionId, $status, $current->amountXof,
        );
    }
}
