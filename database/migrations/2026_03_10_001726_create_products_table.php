<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('public_id', 30)->unique()->comment('Non-sequential public identifier');
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->string('name', 255);
            $table->string('slug', 255)->unique();
            $table->text('description');
            $table->decimal('base_price', 12, 2);
            $table->unsignedInteger('stock')->default(0)->comment('Available capacity');
            $table->unsignedInteger('stock_reserved')->default(0)->comment('Allocated to pending orders');
            $table->enum('status', ['active', 'sold_out', 'archived'])->default('active');
            $table->string('image', 500)->comment('Primary thumbnail URL');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
