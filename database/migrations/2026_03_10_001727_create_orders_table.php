<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 30)->unique()->comment('Human-readable invoice number e.g. INV/2026/03/0001');
            $table->foreignId('customer_id')->constrained('users')->restrictOnDelete();
            $table->enum('status', ['pending', 'paid', 'processing', 'shipping', 'completed', 'cancelled'])
                ->default('pending');

            // Immutable shipping snapshot at time of checkout
            $table->string('shipping_name', 100);
            $table->string('shipping_phone', 20);
            $table->text('shipping_address');
            $table->string('shipping_city', 100);

            $table->decimal('subtotal', 12, 2);
            $table->decimal('shipping_cost', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->text('notes')->nullable()->comment('Customer instructions');
            $table->timestamp('payment_deadline')->nullable()->comment('Auto-cancel if exceeded');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
