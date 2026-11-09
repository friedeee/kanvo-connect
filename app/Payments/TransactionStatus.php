<?php

namespace App\Payments;

use App\Enums\PaymentStatus;

final readonly class TransactionStatus
{
    public function __construct(
        public string $reference,
        public string $providerTransactionId,
        public PaymentStatus $status,
        public int $amountXof,
    ) {}
}
