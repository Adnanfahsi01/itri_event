<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Main database seeder
 * Runs all seeders to populate the database with initial data
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Run seeders in order
        $this->call([
            AdminSeeder::class,
            SeatSeeder::class,
            SpeakerSeeder::class,
            ProgramSeeder::class,
        ]);
    }
}
