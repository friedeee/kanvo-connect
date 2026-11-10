<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ProfileValidationRules;
use App\Enums\SellerCraft;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Création d'un compte vendeur par l'admin : le compte de connexion et la boutique.
 * L'accès est réservé aux admins par le middleware de la route.
 */
class StoreSellerRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            ...$this->profileRules(),
            'shop_name' => ['required', 'string', 'max:120'],
            'craft' => ['required', Rule::enum(SellerCraft::class)],
            'city' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^\+?[0-9 ().-]{8,30}$/'],
            'bio' => ['required', 'string', 'min:30', 'max:3000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nom',
            'shop_name' => 'nom de la boutique',
            'craft' => 'métier',
            'city' => 'ville',
            'phone' => 'téléphone',
            'bio' => 'présentation',
        ];
    }
}
