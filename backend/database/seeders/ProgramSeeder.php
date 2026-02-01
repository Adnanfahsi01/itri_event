<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\Speaker;
use Illuminate\Database\Seeder;

/**
 * Seeder to create sample program sessions
 */
class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $speakers = Speaker::all();
        
        $programs = [
            // Day 1
            [
                'title' => 'Opening Ceremony & Welcome Speech',
                'day' => 'day1',
                'start_time' => '09:00',
                'end_time' => '10:00',
                'speaker_id' => $speakers[0]->id ?? null,
            ],
            [
                'title' => 'Introduction to Artificial Intelligence',
                'day' => 'day1',
                'start_time' => '10:30',
                'end_time' => '12:00',
                'speaker_id' => $speakers[0]->id ?? null,
            ],
            [
                'title' => 'Machine Learning Fundamentals',
                'day' => 'day1',
                'start_time' => '14:00',
                'end_time' => '16:00',
                'speaker_id' => $speakers[1]->id ?? null,
            ],
            
            // Day 2
            [
                'title' => 'Deep Learning and Neural Networks',
                'day' => 'day2',
                'start_time' => '09:00',
                'end_time' => '11:00',
                'speaker_id' => $speakers[1]->id ?? null,
            ],
            [
                'title' => 'Natural Language Processing Workshop',
                'day' => 'day2',
                'start_time' => '11:30',
                'end_time' => '13:00',
                'speaker_id' => $speakers[2]->id ?? null,
            ],
            [
                'title' => 'Computer Vision Applications',
                'day' => 'day2',
                'start_time' => '14:30',
                'end_time' => '16:30',
                'speaker_id' => $speakers[2]->id ?? null,
            ],
            
            // Day 3
            [
                'title' => 'AI in Business and Industry',
                'day' => 'day3',
                'start_time' => '09:00',
                'end_time' => '11:00',
                'speaker_id' => $speakers[3]->id ?? null,
            ],
            [
                'title' => 'Building AI Startups in Morocco',
                'day' => 'day3',
                'start_time' => '11:30',
                'end_time' => '13:00',
                'speaker_id' => $speakers[3]->id ?? null,
            ],
            [
                'title' => 'Closing Ceremony & Networking',
                'day' => 'day3',
                'start_time' => '15:00',
                'end_time' => '17:00',
                'speaker_id' => null,
            ],
        ];

        foreach ($programs as $program) {
            Program::create($program);
        }
    }
}
