<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'public_id',
        'category_id',
        'name',
        'slug',
        'description',
        'base_price',
        'stock',
        'stock_reserved',
        'status',
        'image',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'stock' => 'integer',
            'stock_reserved' => 'integer',
        ];
    }

    // ─── Accessors ───────────────────────────────────────────────────────────

    /** Returns the number of units actually available to order. */
    public function getAvailableStockAttribute(): int
    {
        return max(0, $this->stock - $this->stock_reserved);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function category(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function orderItems(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
