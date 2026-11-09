<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * RM-08 : un vendeur ne gère que ses propres produits.
     */
    public function manage(User $user, Product $product): bool
    {
        return $user->isApprovedSeller() && $user->seller->id === $product->seller_id;
    }
}
