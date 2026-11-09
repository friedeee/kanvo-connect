<?php

namespace App\Http\Requests\Seller;

use App\Enums\SellerCraft;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SellerApplicationRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'shop_name' => ['required', 'string', 'max:120'],
            'craft' => ['required', Rule::enum(SellerCraft::class)],
            'city' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^\+?[0-9 ().-]{8,30}$/'],
            'bio' => ['required', 'string', 'min:30', 'max:3000'],
        ];
    }
}
