<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete()
                ->comment('Restricted from hard delete while referenced');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete()
                ->comment('Null if no variant selected');

            // Immutable product snapshot at time of purchase
            $table->string('product_name', 255);
            $table->string('variant_name', 100)->nullable();
            $table->decimal('unit_price', 12, 2)->comment('Final price per unit at purchase time');
            $table->unsignedInteger('quantity');
            $table->decimal('subtotal', 12, 2)->comment('unit_price * quantity');
            $table->json('product_snapshot')->comment('Full product data frozen at purchase time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
