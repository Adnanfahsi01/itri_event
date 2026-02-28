<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Program Controller
 * Handles CRUD operations for event programs/sessions
 */
class ProgramController extends Controller
{
    /**
     * Get all programs
     * Includes speaker information
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Get all programs with speaker data
        $programs = Program::with('speaker')->get();
        return response()->json($programs);
    }

    /**
     * Get programs filtered by day
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByDay(Request $request)
    {
        $day = $request->input('day');
        
        $programs = Program::with('speaker')
            ->where('day', $day)
            ->orderBy('time')
            ->get();
            
        return response()->json($programs);
    }

    /**
     * Get a single program
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $program = Program::with('speaker')->find($id);
        
        if (!$program) {
            return response()->json([
                'message' => 'Program not found'
            ], 404);
        }

        return response()->json($program);
    }

    /**
     * Create a new program
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Log incoming request for debugging
            Log::info('Program creation request:', [
                'data' => $request->all(),
                'headers' => $request->headers->all()
            ]);

            // Validate incoming data with more flexible rules
            $validated = $request->validate([
                'title' => 'required|string|min:1|max:255',
                'day' => 'required|in:day1,day2,day3',
                'time' => 'required|string|min:1',
                'speaker_id' => 'required|exists:speakers,id',
            ], [
                'title.required' => 'Program title is required.',
                'title.min' => 'Program title cannot be empty.',
                'day.required' => 'Program day is required.',
                'day.in' => 'Day must be one of: day1, day2, or day3.',
                'time.required' => 'Program time is required.',
                'time.min' => 'Program time cannot be empty.',
                'speaker_id.required' => 'Please select a speaker.',
                'speaker_id.exists' => 'Selected speaker does not exist. Please choose a valid speaker.',
            ]);

            // Create program
            $program = Program::create($validated);
            
            // Load speaker relationship
            $program->load('speaker');

            return response()->json([
                'message' => 'Program created successfully for ' . $program->speaker->name . '!',
                'program' => $program,
                'speaker_info' => [
                    'name' => $program->speaker->name,
                    'job_title' => $program->speaker->job_title
                ],
                'next_steps' => [
                    'Program is now visible in the schedule',
                    'You can edit program details anytime',
                    'Participants can see this in their event schedule'
                ]
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Program validation failed:', [
                'errors' => $e->errors(),
                'input' => $request->all()
            ]);
            return response()->json([
                'message' => 'Please check the following errors and try again:',
                'errors' => $e->errors(),
                'input_received' => $request->all(),
                'tips' => [
                    'Day must be: day1, day2, or day3',
                    'Make sure the selected speaker exists',
                    'All fields are required for program creation'
                ]
            ], 422);
        } catch (\Exception $e) {
            Log::error('Program creation failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'input' => $request->all()
            ]);
            return response()->json([
                'message' => 'Failed to save program',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing program
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $program = Program::find($id);
            
            if (!$program) {
                return response()->json([
                    'message' => 'Program not found'
                ], 404);
            }

            // Validate incoming data
            $validated = $request->validate([
                'title' => 'sometimes|required|string|min:1|max:255',
                'day' => 'sometimes|required|in:day1,day2,day3',
                'time' => 'sometimes|required|string|min:1',
                'speaker_id' => 'sometimes|required|exists:speakers,id',
            ], [
                'title.min' => 'Program title cannot be empty.',
                'day.in' => 'Day must be one of: day1, day2, or day3.',
                'time.min' => 'Program time cannot be empty.',
                'speaker_id.exists' => 'Selected speaker does not exist. Please choose a valid speaker.',
            ]);

            // Update program
            $program->update($validated);
            
            // Load speaker relationship
            $program->load('speaker');

            return response()->json([
                'message' => 'Program updated successfully! Speaker: ' . $program->speaker->name,
                'program' => $program->fresh(), // Refresh to get latest data
                'speaker_info' => [
                    'name' => $program->speaker->name,
                    'job_title' => $program->speaker->job_title
                ],
                'updated_fields' => array_keys($validated)
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Program update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update program',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a program
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $program = Program::find($id);
            
            if (!$program) {
                return response()->json([
                    'message' => 'Program not found'
                ], 404);
            }

            $program->delete();

            return response()->json([
                'message' => 'Program deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Program deletion failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete program',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
