<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Speaker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

/**
 * Speaker Controller
 * Handles CRUD operations for speakers
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
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $speaker = Speaker::find($id);
        
        if (!$speaker) {
            return response()->json([
                'message' => 'Speaker not found'
            ], 404);
        }

        return response()->json($speaker);
    }

    /**
     * Create a new speaker
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Log incoming request for debugging
            Log::info('Speaker creation request:', [
                'data' => $request->all(),
                'files' => $request->allFiles(),
                'headers' => $request->headers->all()
            ]);

            // Validate incoming data with more flexible rules
            $validated = $request->validate([
                'name' => 'required|string|min:1|max:255',
                'job_title' => 'required|string|min:1|max:255',
                'bio' => 'required|string|min:1',
                'photo' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // Optional image
            ], [
                'name.required' => 'Speaker name is required.',
                'name.min' => 'Speaker name cannot be empty.',
                'job_title.required' => 'Job title is required.',
                'job_title.min' => 'Job title cannot be empty.',
                'bio.required' => 'Biography is required.',
                'bio.min' => 'Biography cannot be empty.',
                'photo.image' => 'The uploaded file must be an image.',
                'photo.mimes' => 'Photo must be a file of type: jpeg, png, jpg, gif, webp.',
                'photo.max' => 'Photo file size must not exceed 5MB.',
            ]);

            // Handle photo upload if provided
            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('speakers', 'public');
                $validated['photo'] = $path;
            }

            // Create speaker
            $speaker = Speaker::create($validated);

            return response()->json([
                'message' => 'Speaker created successfully! ' . ($request->hasFile('photo') ? 'Photo was uploaded.' : 'No photo was provided.'),
                'speaker' => $speaker,
                'photo_uploaded' => $request->hasFile('photo'),
                'next_steps' => [
                    'You can now assign this speaker to programs',
                    'Edit speaker details anytime from the speakers list',
                    $request->hasFile('photo') ? 'Photo can be changed by editing the speaker' : 'You can add a photo later by editing this speaker'
                ]
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Speaker validation failed:', [
                'errors' => $e->errors(),
                'input' => $request->all()
            ]);
            return response()->json([
                'message' => 'Please check the following errors and try again:',
                'errors' => $e->errors(),
                'input_received' => $request->except(['photo']),
                'tips' => [
                    'Make sure all required fields are filled',
                    'Photo is optional but must be under 5MB if provided',
                    'Supported image formats: JPEG, PNG, JPG, GIF, WebP'
                ]
            ], 422);
        } catch (\Exception $e) {
            Log::error('Speaker creation failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'input' => $request->all()
            ]);
            return response()->json([
                'message' => 'Failed to save speaker',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing speaker
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $speaker = Speaker::find($id);
            
            if (!$speaker) {
                return response()->json([
                    'message' => 'Speaker not found'
                ], 404);
            }

            // Validate incoming data
            $validated = $request->validate([
                'name' => 'sometimes|required|string|min:1|max:255',
                'job_title' => 'sometimes|required|string|min:1|max:255',
                'bio' => 'sometimes|required|string|min:1',
                'photo' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ], [
                'name.min' => 'Speaker name cannot be empty.',
                'job_title.min' => 'Job title cannot be empty.',
                'bio.min' => 'Biography cannot be empty.',
                'photo.image' => 'The uploaded file must be an image.',
                'photo.mimes' => 'Photo must be a file of type: jpeg, png, jpg, gif, webp.',
                'photo.max' => 'Photo file size must not exceed 5MB.',
            ]);

            // Handle photo upload if provided
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
                'message' => 'Speaker updated successfully! ' . ($request->hasFile('photo') ? 'New photo was uploaded.' : 'No photo changes were made.'),
                'speaker' => $speaker->fresh(), // Refresh the model to get latest data
                'photo_updated' => $request->hasFile('photo'),
                'updated_fields' => array_keys($validated)
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Please check the following errors and try again:',
                'errors' => $e->errors(),
                'tips' => [
                    'Photo is optional and must be under 5MB if provided',
                    'Supported image formats: JPEG, PNG, JPG, GIF, WebP'
                ]
            ], 422);
        } catch (\Exception $e) {
            Log::error('Speaker update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update speaker',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a speaker
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $speaker = Speaker::find($id);
            
            if (!$speaker) {
                return response()->json([
                    'message' => 'Speaker not found'
                ], 404);
            }

            // Check if speaker is used in any programs
            if ($speaker->programs()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete speaker. Speaker is assigned to programs.'
                ], 422);
            }

            // Delete photo if exists
            if ($speaker->photo) {
                Storage::disk('public')->delete($speaker->photo);
            }

            $speaker->delete();

            return response()->json([
                'message' => 'Speaker deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Speaker deletion failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete speaker',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
