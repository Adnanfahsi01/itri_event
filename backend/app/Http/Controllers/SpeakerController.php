<?php

namespace App\Http\Controllers;

use App\Models\Speaker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * SpeakerController handles CRUD operations for speakers
 */
class SpeakerController extends Controller
{
    /**
     * Get all speakers
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $speakers = Speaker::all();
        return response()->json($speakers);
    }

    /**
     * Get a single speaker
     * 
     * @param Speaker $speaker
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Speaker $speaker)
    {
        return response()->json($speaker);
    }

    /**
     * Create a new speaker (Admin only)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'job_title' => 'required|string|max:255',
            'bio' => 'required|string',
            'photo' => 'nullable|image|max:2048', // Max 2MB
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('speakers', 'public');
            $validated['photo'] = $path;
        }

        // Create speaker
        $speaker = Speaker::create($validated);

        return response()->json([
            'message' => 'Speaker created successfully',
            'speaker' => $speaker,
        ], 201);
    }

    /**
     * Update an existing speaker (Admin only)
     * 
     * @param Request $request
     * @param Speaker $speaker
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Speaker $speaker)
    {
        // Validate request data
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'job_title' => 'sometimes|required|string|max:255',
            'bio' => 'sometimes|required|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($speaker->photo) {
                Storage::disk('public')->delete($speaker->photo);
            }
            $path = $request->file('photo')->store('speakers', 'public');
            $validated['photo'] = $path;
        }

        // Update speaker
        $speaker->update($validated);

        return response()->json([
            'message' => 'Speaker updated successfully',
            'speaker' => $speaker,
        ]);
    }

    /**
     * Delete a speaker (Admin only)
     * 
     * @param Speaker $speaker
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Speaker $speaker)
    {
        // Delete photo if exists
        if ($speaker->photo) {
            Storage::disk('public')->delete($speaker->photo);
        }

        $speaker->delete();

        return response()->json([
            'message' => 'Speaker deleted successfully',
        ]);
    }
}
