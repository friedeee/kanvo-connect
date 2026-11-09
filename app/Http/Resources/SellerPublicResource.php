<?php

namespace App\Http\Resources;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Informations publiques d'un vendeur. Le téléphone et le compte utilisateur
 * ne sont jamais exposés ici (RM-13).
 *
 * @mixin Seller
 */
class SellerPublicResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'shop_name' => $this->shop_name,
            'slug' => $this->slug,
            'craft' => $this->craft->label(),
            'city' => $this->city,
            'bio' => $this->bio,
            'member_since' => $this->approved_at?->year,
            'products_count' => $this->whenCounted('products'),
        ];
    }
}
