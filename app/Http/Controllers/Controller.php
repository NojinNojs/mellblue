<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

abstract class Controller
{
    /**
     * Resolve an image path to a full URL.
     * Supports both old public/ paths and new storage/ paths.
     */
    protected function resolveImageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        // New storage paths (e.g. "products/xxx.webp", "payments/xxx.jpg")
        if (Storage::disk('public')->exists($path)) {
            return asset('storage/' . $path);
        }

        // Old public path fallback (e.g. "images/products/xxx.webp")
        return asset($path);
    }
}
