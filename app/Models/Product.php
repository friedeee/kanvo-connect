<?php

namespace App\Models;

use App\Enums\ProductStatus;
use App\Enums\SaleUnit;
use App\Exceptions\InvalidStatusTransition;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $seller_id
 * @property int $category_id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property int $price_xof
 * @property SaleUnit $sale_unit
 * @property int $stock_quantity
 * @property int|null $lead_time_days
 * @property int|null $length_cm
 * @property int|null $width_cm
 * @property list<string> $colors
 * @property string|null $materials
 * @property string|null $care_instructions
 * @property ProductStatus $status
 * @property string|null $status_reason
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'category_id', 'name', 'description', 'price_xof', 'sale_unit', 'stock_quantity',
    'lead_time_days', 'length_cm', 'width_cm', 'colors', 'materials', 'care_instructions',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    protected $attributes = [
        'colors' => '[]',
    ];

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            $product->slug ??= Str::slug($product->name).'-'.Str::lower(Str::random(5));
        });
    }

    protected function casts(): array
    {
        return [
            'price_xof' => 'integer',
            'stock_quantity' => 'integer',
            'lead_time_days' => 'integer',
            'length_cm' => 'integer',
            'width_cm' => 'integer',
            'sale_unit' => SaleUnit::class,
            'colors' => 'array',
            'status' => ProductStatus::class,
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Seller, $this>
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<ProductImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('position');
    }

    /**
     * Produits visibles par le public : publiés et rattachés à un vendeur validé (RM-01).
     *
     * @param  Builder<Product>  $query
     */
    public function scopeInCatalog(Builder $query): void
    {
        $query->where('status', ProductStatus::Published)
            ->whereHas('seller', fn (Builder $seller) => $seller->approved());
    }

    /**
     * Disponible à l'achat : en stock, ou fabriqué à la commande.
     *
     * @param  Builder<Product>  $query
     */
    public function scopeAvailable(Builder $query): void
    {
        $query->where(fn (Builder $q) => $q->where('stock_quantity', '>', 0)->orWhereNotNull('lead_time_days'));
    }

    public function isAvailable(): bool
    {
        return $this->stock_quantity > 0 || $this->lead_time_days !== null;
    }

    public function isInCatalog(): bool
    {
        return $this->status === ProductStatus::Published && $this->seller->isApproved();
    }

    public function submitForReview(): void
    {
        if (! $this->status->canBeSubmitted()) {
            throw InvalidStatusTransition::make('le produit', $this->status->label(), 'soumettre à validation');
        }

        $this->transition(ProductStatus::PendingReview, 'product.submitted');
    }

    public function publish(): void
    {
        $this->ensureStatus([ProductStatus::PendingReview, ProductStatus::Withdrawn], 'publier');

        $this->transition(ProductStatus::Published, 'product.published', extra: ['published_at' => now()]);
    }

    public function reject(string $reason): void
    {
        $this->ensureStatus([ProductStatus::PendingReview], 'refuser');

        $this->transition(ProductStatus::Rejected, 'product.rejected', $reason);
    }

    public function withdraw(string $reason): void
    {
        $this->ensureStatus([ProductStatus::Published, ProductStatus::PendingReview], 'retirer');

        $this->transition(ProductStatus::Withdrawn, 'product.withdrawn', $reason);
    }

    public function disable(): void
    {
        $this->ensureStatus([ProductStatus::Published, ProductStatus::PendingReview], 'désactiver');

        $this->transition(ProductStatus::Disabled, 'product.disabled');
    }

    /**
     * Une modification du contenu d'un produit publié le renvoie en validation :
     * l'administration valide ce qui est réellement affiché.
     */
    public function returnToReviewAfterEdit(): void
    {
        if ($this->status === ProductStatus::Published) {
            $this->transition(ProductStatus::PendingReview, 'product.resubmitted_after_edit');
        }
    }

    /**
     * @param  list<ProductStatus>  $from
     */
    private function ensureStatus(array $from, string $verb): void
    {
        if (! in_array($this->status, $from, true)) {
            throw InvalidStatusTransition::make('le produit', $this->status->label(), $verb);
        }
    }

    /**
     * @param  array<string, mixed>  $extra
     */
    private function transition(ProductStatus $to, string $action, ?string $reason = null, array $extra = []): void
    {
        DB::transaction(function () use ($to, $action, $reason, $extra) {
            $previous = $this->status;

            $this->forceFill([...$extra, 'status' => $to, 'status_reason' => $reason])->save();

            AuditLog::record($action, $this, array_filter([
                'from' => $previous->value,
                'to' => $to->value,
                'reason' => $reason,
            ]));
        });
    }
}
