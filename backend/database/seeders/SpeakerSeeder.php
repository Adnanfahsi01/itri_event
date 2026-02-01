<?php

namespace Database\Seeders;

use App\Models\Speaker;
use Illuminate\Database\Seeder;

/**
 * Seeder to create sample speakers
 */
class SpeakerSeeder extends Seeder
{
    public function run(): void
    {
        $speakers = [
            [
                'name' => 'Dr. Ahmed Benali',
                'job_title' => 'AI Research Director',
                'bio' => 'Leading AI researcher with 15 years of experience in machine learning and deep learning. Previously worked at Google AI and MIT.',
                'photo' => null,
            ],
            [
                'name' => 'Sarah Johnson',
                'job_title' => 'Data Science Lead at Microsoft',
                'bio' => 'Expert in data analytics and business intelligence. Speaker at multiple international tech conferences.',
                'photo' => null,
            ],
            [
                'name' => 'Prof. Mohamed Tazi',
                'job_title' => 'Professor of Computer Science',
                'bio' => 'Professor at University of Tanger, specializing in natural language processing and computer vision.',
                'photo' => null,
            ],
            [
                'name' => 'Fatima Zahra Alami',
                'job_title' => 'CEO of TechMorocco',
                'bio' => 'Entrepreneur and tech visionary. Founded multiple successful startups in the AI space.',
                'photo' => null,
            ],
        ];

        foreach ($speakers as $speaker) {
            Speaker::create($speaker);
        }
    }
}
