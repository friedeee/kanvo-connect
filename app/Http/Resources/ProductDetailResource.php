<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductDetailResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $colors = config('kanvo.colors');

        return [
            ...(new ProductCardResource($this->resource))->toArray($request),
            'description' => $this->description,
            'stock_quantity' => $this->stock_quantity,
            'length_cm' => $this->length_cm,
            'width_cm' => $this->width_cm,
            'colors' => array_map(fn (string $color) => $colors[$color] ?? $color, $this->colors),
            'materials' => $this->materials,
            'care_instructions' => $this->care_instructions,
            'images' => $this->images->map(fn ($image) => ['id' => $image->id, 'url' => $image->url]),
            'seller' => (new SellerPublicResource($this->seller))->resolve($request),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
        ];
    }
}
