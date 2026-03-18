<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Public Routes (No Auth Required) ────────────────────────────────────────

Route::get('/', [\App\Http\Controllers\ProductController::class, 'home'])->name('home');

Route::get('/products', [\App\Http\Controllers\ProductController::class, 'index'])->name('products.index');
Route::get('/products/{id}', [\App\Http\Controllers\ProductController::class, 'show'])->name('products.show');

// ─── Authenticated User Routes ────────────────────────────────────────────────

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('under-construction', function () {
        return Inertia::render('under-construction');
    })->name('under-construction');

    // Checkout & Orders
    Route::get('/checkout', [\App\Http\Controllers\OrderController::class, 'create'])->name('checkout');
    Route::post('/orders', [\App\Http\Controllers\OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [\App\Http\Controllers\OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/payment', [\App\Http\Controllers\OrderController::class, 'uploadPayment'])->name('orders.payment');
    Route::post('/orders/{order}/cancel', [\App\Http\Controllers\OrderController::class, 'cancel'])->name('orders.cancel');
    Route::patch('/orders/{order}/complete', [\App\Http\Controllers\OrderController::class, 'complete'])->name('orders.complete');
    Route::get('/orders/{order}/receipt', [\App\Http\Controllers\OrderController::class, 'receipt'])->name('orders.receipt');
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────

Route::middleware(['auth', 'verified', \App\Http\Middleware\EnsureUserIsAdmin::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

        // User management
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->except(['show', 'create', 'edit']);
        // Category management
        Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class)->except(['show', 'create', 'edit']);

        // Product management
        Route::delete('products/bulk-destroy', [\App\Http\Controllers\Admin\ProductController::class, 'bulkDestroy'])->name('products.bulk-destroy');
        Route::patch('products/{product}/toggle-status', [\App\Http\Controllers\Admin\ProductController::class, 'toggleStatus'])->name('products.toggle-status');
        Route::resource('products', \App\Http\Controllers\Admin\ProductController::class)->except(['show', 'create', 'edit']);

        // Order management
        Route::resource('orders', \App\Http\Controllers\Admin\OrderController::class)->only(['index', 'show']);
        Route::post('orders/{order}/verify', [\App\Http\Controllers\Admin\OrderController::class, 'verify'])->name('orders.verify');
        Route::post('orders/{order}/ship', [\App\Http\Controllers\Admin\OrderController::class, 'ship'])->name('orders.ship');
        Route::patch('orders/{order}/status', [\App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.update-status');
    });

require __DIR__ . '/settings.php';
