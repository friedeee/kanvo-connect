<?php

namespace App\Providers;

use App\Payments\FakePaymentGateway;
use App\Payments\PaymentGateway;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use RuntimeException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(PaymentGateway::class, function () {
            $driver = config('kanvo.payment.driver');

            return match (true) {
                $driver === 'fake' && $this->app->isProduction() => throw new RuntimeException(
                    'Le prestataire de paiement simulé ne peut pas être utilisé en production.'
                ),
                $driver === 'fake' => new FakePaymentGateway,
                default => throw new RuntimeException("Prestataire de paiement non pris en charge : {$driver}"),
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
