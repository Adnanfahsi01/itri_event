<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration to create the seats table
 * Stores all available seats for the event
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seats', function (Blueprint $table) {
            $table->id();
            $table->string('seat_number'); // e.g., L-A1, R-B3
            $table->enum('block', ['left', 'right']); // Left or Right block
            $table->integer('row_number'); // Row number (1-10)
            $table->integer('seat_index'); // Position in row (1-5)
            $table->enum('type', ['regular', 'vip'])->default('regular');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};
