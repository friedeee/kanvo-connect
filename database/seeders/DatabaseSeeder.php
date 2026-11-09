<?php

namespace Database\Seeders;

use App\Enums\ProductStatus;
use App\Enums\SaleUnit;
use App\Enums\SellerCraft;
use App\Models\Category;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Données de démonstration pour le développement local. Les vendeurs et produits
 * sont fictifs ; aucune information culturelle ou de provenance n'est présentée
 * comme vérifiée (RM-12).
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->isProduction()) {
            throw new RuntimeException('Les données de démonstration ne doivent pas être chargées en production.');
        }

        $categories = collect([
            'Pagnes tissés' => 'Pagnes tissés à la main, vendus à la pièce ou en lot.',
            'Créations textiles' => 'Vêtements et pièces confectionnés à partir de pagnes tissés.',
            'Accessoires' => 'Sacs, écharpes, pochettes et petits objets.',
            'Décoration' => 'Coussins, nappes et tentures.',
        ])->map(fn (string $description, string $name) => Category::create([
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $description,
        ]))->values();

        User::factory()->admin()->create([
            'name' => 'Admin Kanvô',
            'email' => 'admin@kanvo.test',
        ]);

        User::factory()->create([
            'name' => 'Client Démo',
            'email' => 'client@kanvo.test',
        ]);

        $sellers = [
            ['Atelier démo Abomey', SellerCraft::Weaver, 'Abomey', 'vendeur@kanvo.test'],
            ['Atelier démo Porto-Novo', SellerCraft::Workshop, 'Porto-Novo', null],
            ['Studio démo Cotonou', SellerCraft::Designer, 'Cotonou', null],
        ];

        foreach ($sellers as [$name, $craft, $city, $email]) {
            $seller = Seller::factory()
                ->approved()
                ->for(User::factory()->state(array_filter(['email' => $email, 'name' => $name])))
                ->create(['shop_name' => $name, 'craft' => $craft, 'city' => $city, 'bio' => "{$name} — vendeur fictif utilisé pour la démonstration de Kanvô Connect."]);

            foreach (range(1, 4) as $i) {
                Product::factory()->for($seller)->create([
                    'category_id' => $categories[$i % $categories->count()]->id,
                    'name' => "Produit démo {$i} — {$city}",
                    'description' => 'Produit fictif de démonstration. Les vendeurs renseigneront leurs propres descriptions, matières et dimensions.',
                    'sale_unit' => $i === 2 ? SaleUnit::Lot : SaleUnit::Pagne,
                    'stock_quantity' => $i === 4 ? 0 : $i * 2,
                    'lead_time_days' => $i === 3 ? 14 : null,
                    'status' => ProductStatus::Published,
                    'published_at' => now()->subDays($i),
                ]);
            }
        }

        Product::factory()->for(Seller::where('shop_name', 'Atelier démo Abomey')->sole())->pendingReview()->create([
            'category_id' => $categories[0]->id,
            'name' => 'Produit démo en attente de validation',
        ]);

        Seller::factory()->for(User::factory()->state(['name' => 'Candidat Démo', 'email' => 'candidat@kanvo.test']))->create([
            'shop_name' => 'Candidature démo',
            'bio' => 'Demande vendeur fictive, en attente de validation par l’administration.',
        ]);
    }
}
