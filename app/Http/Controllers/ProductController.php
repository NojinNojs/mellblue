<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(private ProductService $productService)
    {
    }

    /**
     * Display a public listing of all active products.
     */
    public function index(Request $request)
    {
        $products = $this->productService->getPublicProducts();

        return Inertia::render('products', [
            'products' => ['data' => $products],
        ]);
    }

    /**
     * Display a single product detail page.
     */
    public function show(string $id)
    {
        $product = $this->productService->getProductDetails($id);

        return Inertia::render('product-detail', [
            'product' => $product,
        ]);
    }

    /**
     * Render the homepage with the latest products.
     */
    public function home()
    {
        $latestProducts = $this->productService->getLatestProducts(8);

        return Inertia::render('home', [
            'latestProducts' => $latestProducts,
        ]);
    }
}
