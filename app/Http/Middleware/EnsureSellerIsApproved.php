<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * RM-01 : seuls les vendeurs validés gèrent des produits.
 */
class EnsureSellerIsApproved
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isApprovedSeller()) {
            return to_route('seller.dashboard');
        }

        return $next($request);
    }
}
