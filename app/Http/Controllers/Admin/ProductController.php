<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(private ProductService $productService)
    {
    }

    public function index(Request $request)
    {
        $products = Product::with(['images', 'category:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($product) => $this->productService->formatProduct($product));

        $categories = Category::all();

        return Inertia::render('admin/products', [
            'products' => ['data' => $products],
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'base_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:webp,png,jpg,jpeg|max:5120',
        ]);

        $product = Product::create([
            'public_id' => 'PRD-' . strtoupper(Str::random(8)),
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(6),
            'description' => $validated['description'],
            'base_price' => $validated['base_price'],
            'stock' => $validated['stock'],
            'image' => 'products/placeholder.webp',
        ]);

        if ($request->hasFile('images')) {
            try {
                $this->uploadImages($product, $request->file('images'));
            } catch (\Exception $e) {
                $product->delete();
                return redirect()->back()
                    ->withErrors(['images' => 'Failed to upload images: ' . $e->getMessage()])
                    ->withInput();
            }
        }

        return redirect()->back()->with('success', 'Product created successfully!');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'base_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'status' => 'required|in:active,sold_out,archived',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:webp,png,jpg,jpeg|max:5120',
            'delete_images' => 'nullable|array',
            'delete_images.*' => 'integer|exists:product_images,id',
        ]);

        $product->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'base_price' => $validated['base_price'],
            'stock' => $validated['stock'],
            'status' => $validated['status'],
        ]);

        if ($request->has('delete_images') && is_array($request->delete_images)) {
            $toDelete = ProductImage::whereIn('id', $request->delete_images)
                ->where('product_id', $product->id)
                ->get();

            foreach ($toDelete as $image) {
                $this->deleteImageFile($image->image_url);
                $image->delete();
            }
        }

        if ($request->hasFile('images')) {
            try {
                $this->uploadImages($product, $request->file('images'));
            } catch (\Exception $e) {
                return redirect()->back()
                    ->withErrors(['images' => 'Failed to upload images: ' . $e->getMessage()])
                    ->withInput();
            }
        }

        return redirect()->back()->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {
        foreach ($product->images as $image) {
            $this->deleteImageFile($image->image_url);
        }

        $product->delete(); // SoftDelete

        return redirect()->back()->with('success', 'Product archived successfully!');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id',
        ]);

        $products = Product::whereIn('id', $request->ids)->get();

        foreach ($products as $product) {
            foreach ($product->images as $image) {
                $this->deleteImageFile($image->image_url);
            }
            $product->delete();
        }

        return redirect()->back()->with('success', 'Selected products archived successfully!');
    }

    public function toggleStatus(Request $request, Product $product)
    {
        $request->validate([
            'status' => 'required|in:active,sold_out,archived',
        ]);

        $product->update(['status' => $request->status]);

        return back()->with('success', 'Product status updated successfully.');
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    private function uploadImages(Product $product, array $images): void
    {
        foreach ($images as $index => $image) {
            $filename = time() . '_' . Str::random(10) . '.webp';
            $tempPath = sys_get_temp_dir() . '/' . $filename;

            $this->convertToWebP($image->getPathname(), $tempPath);

            $storagePath = 'products/' . $filename;
            Storage::disk('public')->put($storagePath, file_get_contents($tempPath));
            @unlink($tempPath);

            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $storagePath,
                'sort_order' => $index,
            ]);

            // Set first uploaded image as primary thumbnail
            if ($index === 0 && $product->image === 'products/placeholder.webp') {
                $product->update(['image' => $storagePath]);
            }
        }
    }

    private function convertToWebP(string $sourcePath, string $destinationPath, int $quality = 85): void
    {
        if (empty($sourcePath) || !file_exists($sourcePath) || !is_readable($sourcePath)) {
            throw new \Exception('Invalid or unreadable source image path');
        }

        $imageInfo = @getimagesize($sourcePath);
        if ($imageInfo === false) {
            throw new \Exception('Unable to read image file');
        }

        $image = match ($imageInfo['mime']) {
            'image/jpeg' => @imagecreatefromjpeg($sourcePath),
            'image/png' => @imagecreatefrompng($sourcePath),
            'image/gif' => @imagecreatefromgif($sourcePath),
            'image/webp' => @imagecreatefromwebp($sourcePath),
            default => throw new \Exception('Unsupported image type: ' . $imageInfo['mime']),
        };

        if ($image === false) {
            throw new \Exception('Failed to create image resource from file');
        }

        $result = @imagewebp($image, $destinationPath, $quality);
        imagedestroy($image);

        if ($result === false) {
            throw new \Exception('Failed to convert image to WebP format');
        }
    }

    private function deleteImageFile(string $imagePath): void
    {
        // Support both old public/ paths and new storage/ paths
        if (Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        } else {
            // Fallback: try old public_path location
            $fullPath = public_path($imagePath);
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
        }
    }
}
