<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration to create the reservations table
 * Stores user reservation information
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone');
            $table->enum('role', ['student', 'employee']);
            $table->string('institution_name')->nullable(); // Only for students
            $table->json('days'); // ['day1', 'day2', 'day3'] or subset
            $table->json('seat_numbers')->nullable(); // Array of seat info
            $table->string('ticket_code')->unique(); // Unique ticket code
            $table->text('qr_code'); // QR code data
            $table->boolean('is_used')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
