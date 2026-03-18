<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('name', 100)->comment('e.g. Large, Small, Extra Topping');
            $table->decimal('price_adjustment', 12, 2)->comment('Added to base_price, can be negative');
            $table->unsignedInteger('stock')->default(0);
            $table->enum('status', ['active', 'sold_out'])->default('active');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
