<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('dataset_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('invoice_no', 50);
            $table->string('stock_code', 50);
            $table->text('description')->nullable();
            $table->integer('quantity');
            $table->dateTime('invoice_date');
            $table->decimal('unit_price', 12, 2);
            $table->string('customer_id', 50)->nullable();
            $table->string('country', 100);
            $table->decimal('total_sales', 15, 2);

            $table->index('invoice_date');
            $table->index('country');
            $table->index('invoice_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
