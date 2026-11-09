<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('shop_name');
            $table->string('slug')->unique();
            $table->string('craft');
            $table->string('city');
            $table->string('phone', 30);
            $table->text('bio');
            $table->string('status')->default('pending')->index();
            // Motif du dernier refus ou de la dernière suspension, montré au vendeur.
            $table->text('status_reason')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sellers');
    }
};
