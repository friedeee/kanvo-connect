<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductCardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'price_xof' => $this->price_xof,
            'sale_unit' => $this->sale_unit->label(),
            'is_available' => $this->isAvailable(),
            'lead_time_days' => $this->lead_time_days,
            'image_url' => $this->images->first()?->url,
            'category' => $this->category->name,
            'seller' => [
                'shop_name' => $this->seller->shop_name,
                'slug' => $this->seller->slug,
            ],
        ];
    }
}
