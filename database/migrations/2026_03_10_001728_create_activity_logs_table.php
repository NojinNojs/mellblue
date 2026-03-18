<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()
                ->comment('Actor who performed the action');
            $table->string('action', 50)
                ->comment('e.g. create, update, delete, restock, status_change');
            $table->string('subject_type', 100)
                ->comment('Entity type e.g. Product, Order, Payment');
            $table->unsignedBigInteger('subject_id')
                ->comment('ID of the affected record');
            $table->json('old_values')->nullable()
                ->comment('Previous state, null on create');
            $table->json('new_values')->nullable()
                ->comment('Updated state, null on delete');
            $table->string('ip_address', 45)
                ->comment('Supports IPv4 and IPv6');
            $table->timestamp('created_at')->useCurrent();

            // Indexed for fast lookups by entity
            $table->index(['subject_type', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
