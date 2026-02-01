<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;

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
        // Validate incoming data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'day' => 'required|in:Day 1,Day 2,Day 3',
            'time' => 'required|string', // e.g., "10:00 - 11:00"
            'speaker_id' => 'required|exists:speakers,id',
        ]);

        // Create program
        $program = Program::create($validated);
        
        // Load speaker relationship
        $program->load('speaker');

        return response()->json([
            'message' => 'Program created successfully',
            'program' => $program
        ], 201);
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
        $program = Program::find($id);
        
        if (!$program) {
            return response()->json([
                'message' => 'Program not found'
            ], 404);
        }

        // Validate incoming data
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'day' => 'sometimes|required|in:Day 1,Day 2,Day 3',
            'time' => 'sometimes|required|string',
            'speaker_id' => 'sometimes|required|exists:speakers,id',
        ]);

        // Update program
        $program->update($validated);
        
        // Load speaker relationship
        $program->load('speaker');

        return response()->json([
            'message' => 'Program updated successfully',
            'program' => $program
        ]);
    }

    /**
     * Delete a program
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
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
    }
}
