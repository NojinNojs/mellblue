<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    /**
     * Get all active products for public listing.
     */
    public function getPublicProducts(): Collection
    {
        return Product::with(['images', 'category:id,name', 'variants'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn(Product $product) => $this->formatProduct($product));
    }

    /**
     * Get latest products for the homepage.
     */
    public function getLatestProducts(int $limit = 8): Collection
    {
        return Product::with(['images', 'category:id,name'])
            ->latest()
            ->take($limit)
            ->get()
            ->map(fn(Product $product) => $this->formatProduct($product));
    }

    /**
     * Get details of a single product by public_id or slug.
     */
    public function getProductDetails(string $id): array
    {
        $product = Product::with(['images', 'category:id,name', 'variants'])
            ->where('public_id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        return $this->formatProduct($product);
    }

    /**
     * Reusable product DTO formatter.
     */
    public function formatProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'public_id' => $product->public_id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'base_price' => $product->base_price,
            'stock' => $product->stock,
            'available_stock' => $product->available_stock,
            'status' => $product->trashed() ? 'archived' : $product->status,
            'category_id' => $product->category_id,
            'category' => $product->category?->name,
            'images' => $product->images->map(fn($img) => [
                'id' => $img->id,
                'url' => $this->getImageUrl($img->image_url),
            ])->values()->all(),
            'variants' => $product->variants->map(fn($v) => [
                'id' => $v->id,
                'name' => $v->name,
                'price_adjustment' => $v->price_adjustment,
                'stock' => $v->stock,
                'status' => $v->status,
            ])->values()->all(),
            'created_at' => $product->created_at->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Resolve image URL, supporting both old public/ and new storage/ paths.
     */
    public function getImageUrl(string $path): string
    {
        // New storage paths (e.g. "products/xxx.webp")
        if (Storage::disk('public')->exists($path)) {
            return asset('storage/' . $path);
        }

        // Old public path fallback (e.g. "images/products/xxx.webp")
        return asset($path);
    }
}
