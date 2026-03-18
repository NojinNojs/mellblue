<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->enum('type', ['payment', 'refund'])->default('payment');
            $table->enum('method', ['bank_transfer', 'qris']);
            $table->string('proof_image_url', 500)->nullable()
                ->comment('Required for payment type, optional for refund');
            $table->string('sender_account', 100)->nullable()
                ->comment('Sender bank account or name');
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('reject_reason')->nullable()
                ->comment('Populated when status is rejected');
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete()
                ->comment('Admin who verified or rejected');
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
