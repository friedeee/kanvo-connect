<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained()->restrictOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            // Montant entier en FCFA : le XOF n'a pas de subdivision.
            $table->unsignedBigInteger('price_xof');
            $table->string('sale_unit');
            $table->unsignedInteger('stock_quantity')->default(0);
            // Renseigné quand le produit est fabriqué à la commande.
            $table->unsignedSmallInteger('lead_time_days')->nullable();
            // Dimensions structurées pour permettre le filtre du catalogue.
            $table->unsignedSmallInteger('length_cm')->nullable();
            $table->unsignedSmallInteger('width_cm')->nullable();
            $table->jsonb('colors')->default('[]');
            $table->string('materials')->nullable();
            $table->text('care_instructions')->nullable();
            $table->string('status')->default('draft');
            $table->text('status_reason')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'category_id']);
        });

        // RM-04 : le stock ne peut jamais devenir négatif, même en cas d'écriture concurrente.
        DB::statement('ALTER TABLE products ADD CONSTRAINT products_stock_quantity_non_negative CHECK (stock_quantity >= 0)');
        DB::statement('ALTER TABLE products ADD CONSTRAINT products_price_xof_positive CHECK (price_xof > 0)');
        DB::statement('CREATE INDEX products_colors_gin ON products USING gin (colors)');
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
