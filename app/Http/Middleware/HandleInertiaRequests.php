<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'seller' => fn () => $request->user()?->seller?->only(['shop_name', 'slug', 'status']),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'whatsappNumber' => $this->whatsappNumber(),
        ];
    }

    /**
     * Numéro WhatsApp de Kanvô réduit à ses chiffres, comme l'exige wa.me ; null s'il n'est pas configuré.
     */
    private function whatsappNumber(): ?string
    {
        $digits = preg_replace('/\D/', '', (string) config('kanvo.whatsapp'));

        return $digits !== '' ? $digits : null;
    }
}
