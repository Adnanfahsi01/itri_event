<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration to create the reservation_seats pivot table
 * Links reservations to seats for specific days
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservation_seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
            $table->foreignId('seat_id')->constrained()->onDelete('cascade');
            $table->enum('day', ['day1', 'day2', 'day3']);
            $table->timestamps();
            
            // A seat can only be reserved once per day
            $table->unique(['seat_id', 'day']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservation_seats');
    }
};
