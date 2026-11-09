<?php

namespace App\Http\Requests\Seller;

use App\Enums\SaleUnit;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class ProductRequest extends FormRequest
{
    /**
     * Champs de contenu : leur modification renvoie un produit publié en validation.
     */
    public const CONTENT_FIELDS = [
        'category_id', 'name', 'description', 'price_xof', 'sale_unit', 'length_cm',
        'width_cm', 'colors', 'materials', 'care_instructions',
    ];

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', Rule::exists('categories', 'id')],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['required', 'string', 'min:20', 'max:5000'],
            'price_xof' => ['required', 'integer', 'min:100', 'max:100000000'],
            'sale_unit' => ['required', Rule::enum(SaleUnit::class)],
            'stock_quantity' => ['required', 'integer', 'min:0', 'max:100000'],
            'lead_time_days' => ['nullable', 'integer', 'min:1', 'max:365'],
            'length_cm' => ['nullable', 'integer', 'min:1', 'max:5000'],
            'width_cm' => ['nullable', 'integer', 'min:1', 'max:5000'],
            'colors' => ['nullable', 'array', 'max:6'],
            'colors.*' => ['distinct', Rule::in(array_keys(config('kanvo.colors')))],
            'materials' => ['nullable', 'string', 'max:255'],
            'care_instructions' => ['nullable', 'string', 'max:2000'],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_image_ids' => ['nullable', 'array'],
            'remove_image_ids.*' => ['integer'],
        ];
    }

    /**
     * @return list<callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                $product = $this->route('product');
                $existing = $product instanceof Product
                    ? $product->images()->whereNotIn('id', $this->input('remove_image_ids', []))->count()
                    : 0;
                $max = config('kanvo.max_product_images');

                if ($existing + count(Arr::wrap($this->file('images', []))) > $max) {
                    $validator->errors()->add('images', "Un produit ne peut pas avoir plus de {$max} photos.");
                }
            },
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function productAttributes(): array
    {
        return [
            ...$this->safe()->except(['images', 'remove_image_ids']),
            'colors' => $this->validated('colors', []),
        ];
    }
}
