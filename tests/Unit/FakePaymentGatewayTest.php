<?php

namespace Tests\Unit;

use App\Enums\PaymentStatus;
use App\Payments\CheckoutRequest;
use App\Payments\FakePaymentGateway;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;
use RuntimeException;

class FakePaymentGatewayTest extends TestCase
{
    private function request(int $amount = 35000): CheckoutRequest
    {
        return new CheckoutRequest('KC-0001', $amount, 'Commande KC-0001', 'https://kanvo.test/retour', 'https://kanvo.test/notif');
    }

    public function test_replaying_a_checkout_reuses_the_same_transaction(): void
    {
        $gateway = new FakePaymentGateway;

        $first = $gateway->createCheckout($this->request());
        $second = $gateway->createCheckout($this->request());

        $this->assertSame($first->providerTransactionId, $second->providerTransactionId);
        $this->assertSame(PaymentStatus::Pending, $gateway->fetchTransaction('KC-0001')->status);
    }

    public function test_a_settled_transaction_cannot_change_again(): void
    {
        $gateway = new FakePaymentGateway;
        $gateway->createCheckout($this->request());

        $gateway->settle('KC-0001', PaymentStatus::Failed);
        $this->assertSame(PaymentStatus::Failed, $gateway->fetchTransaction('KC-0001')->status);

        $this->expectException(RuntimeException::class);
        $gateway->settle('KC-0001', PaymentStatus::Succeeded);
    }

    public function test_amount_must_be_positive(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->request(0);
    }
}
