<?php

namespace App\Models;

use App\Enums\SellerCraft;
use App\Enums\SellerStatus;
use App\Exceptions\InvalidStatusTransition;
use Database\Factories\SellerFactory;
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
 * @property int $user_id
 * @property string $shop_name
 * @property string $slug
 * @property SellerCraft $craft
 * @property string $city
 * @property string $phone
 * @property string $bio
 * @property SellerStatus $status
 * @property string|null $status_reason
 * @property Carbon|null $approved_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['shop_name', 'craft', 'city', 'phone', 'bio'])]
class Seller extends Model
{
    /** @use HasFactory<SellerFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (Seller $seller) {
            $seller->slug ??= Str::slug($seller->shop_name).'-'.Str::lower(Str::random(5));
        });
    }

    protected function casts(): array
    {
        return [
            'craft' => SellerCraft::class,
            'status' => SellerStatus::class,
            'approved_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<Product, $this>
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * @param  Builder<Seller>  $query
     */
    public function scopeApproved(Builder $query): void
    {
        $query->where('status', SellerStatus::Approved);
    }

    public function isApproved(): bool
    {
        return $this->status === SellerStatus::Approved;
    }

    public function approve(): void
    {
        $this->transition([SellerStatus::Pending], SellerStatus::Approved, 'valider', 'seller.approved', [
            'approved_at' => now(),
        ]);
    }

    public function reject(string $reason): void
    {
        $this->transition([SellerStatus::Pending], SellerStatus::Rejected, 'refuser', 'seller.rejected', [], $reason);
    }

    public function suspend(string $reason): void
    {
        $this->transition([SellerStatus::Approved], SellerStatus::Suspended, 'suspendre', 'seller.suspended', [], $reason);
    }

    public function reactivate(): void
    {
        $this->transition([SellerStatus::Suspended], SellerStatus::Approved, 'réactiver', 'seller.reactivated');
    }

    /**
     * @param  list<SellerStatus>  $from
     * @param  array<string, mixed>  $extra
     */
    private function transition(array $from, SellerStatus $to, string $verb, string $action, array $extra = [], ?string $reason = null): void
    {
        if (! in_array($this->status, $from, true)) {
            throw InvalidStatusTransition::make('le vendeur', $this->status->label(), $verb);
        }

        DB::transaction(function () use ($to, $action, $extra, $reason) {
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
