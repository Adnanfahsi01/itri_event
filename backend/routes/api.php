<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SpeakerController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\SeatController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\Api\Admin\SpeakerController as AdminSpeakerController;
use App\Http\Controllers\Api\Admin\ProgramController as AdminProgramController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// ==========================================
// PUBLIC ROUTES (No authentication required)
// ==========================================

// Authentication
Route::post('/admin/login', [AuthController::class, 'login']);

// Speakers - Public access
Route::get('/speakers', [SpeakerController::class, 'index']);
Route::get('/speakers/{speaker}', [SpeakerController::class, 'show']);

// Programs - Public access
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/{program}', [ProgramController::class, 'show']);

// Seats - Public access
Route::get('/seats', [SeatController::class, 'index']);
Route::get('/seats/availability', [SeatController::class, 'availability']);

// Reservations - Public (create only)
Route::post('/reservations', [ReservationController::class, 'store']);

// Download ticket - Public
Route::get('/tickets/{ticketCode}/download', [ReservationController::class, 'downloadTicket']);


// ==========================================
// PROTECTED ROUTES (Admin authentication required)
// ==========================================

Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/me', [AuthController::class, 'me']);
    
    // Debug route to test authentication
    Route::get('/admin/test-auth', function (Request $request) {
        return response()->json([
            'message' => 'Authentication working',
            'user' => $request->user(),
            'user_id' => $request->user()->id ?? 'No user',
            'headers' => [
                'authorization' => $request->header('Authorization'),
                'bearer_token' => $request->bearerToken()
            ]
        ]);
    });
    
    // Test route for creating speakers without validation
    Route::post('/admin/test-speaker', function (Request $request) {
        try {
            Log::info('Test speaker request:', $request->all());
            
            $speaker = \App\Models\Speaker::create([
                'name' => $request->get('name', 'Test Speaker ' . now()->timestamp),
                'job_title' => $request->get('job_title', 'Test Job'),
                'bio' => $request->get('bio', 'Test bio')
            ]);
            
            return response()->json([
                'message' => 'Test speaker created successfully',
                'speaker' => $speaker
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create test speaker',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    });

    // Test route for creating programs
    Route::post('/admin/test-program', function (Request $request) {
        try {
            Log::info('Test program request:', $request->all());
            
            // Get the first speaker or create one if none exists
            $speaker = \App\Models\Speaker::first();
            if (!$speaker) {
                $speaker = \App\Models\Speaker::create([
                    'name' => 'Default Speaker',
                    'job_title' => 'Default Job', 
                    'bio' => 'Default bio'
                ]);
            }
            
            $program = \App\Models\Program::create([
                'title' => $request->get('title', 'Test Program ' . now()->timestamp),
                'day' => $request->get('day', 'day1'),
                'time' => $request->get('time', '10:00 - 11:00'),
                'speaker_id' => $speaker->id
            ]);
            
            return response()->json([
                'message' => 'Test program created successfully',
                'program' => $program
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create test program',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    });

    // Validation test route - returns what validation would expect
    Route::post('/admin/validate-speaker', function (Request $request) {
        try {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'name' => 'required|string|min:1|max:255',
                'job_title' => 'required|string|min:1|max:255',
                'bio' => 'required|string|min:1',
                'photo' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
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

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Please check the following errors and try again:',
                    'validation_errors' => $validator->errors(),
                    'received_data' => $request->except(['photo']),
                    'has_photo' => $request->hasFile('photo'),
                    'photo_info' => $request->hasFile('photo') ? [
                        'name' => $request->file('photo')->getClientOriginalName(),
                        'mime' => $request->file('photo')->getMimeType(),
                        'size' => round($request->file('photo')->getSize() / 1024, 2) . ' KB',
                    ] : null,
                    'tips' => [
                        'Photo is completely optional',
                        'If uploading photo, max size is 5MB',
                        'Supported formats: JPEG, PNG, JPG, GIF, WebP'
                    ]
                ], 422);
            }

            return response()->json([
                'message' => 'Validation passed! Data is ready for submission.',
                'data' => $validator->validated(),
                'photo_status' => $request->hasFile('photo') ? 'Photo uploaded successfully' : 'No photo provided (optional)'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Validation error occurred',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    });

    Route::post('/admin/validate-program', function (Request $request) {
        try {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
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

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Please check the following errors and try again:',
                    'validation_errors' => $validator->errors(),
                    'received_data' => $request->all(),
                    'available_speakers' => \App\Models\Speaker::select('id', 'name')->get(),
                    'tips' => [
                        'Day must be exactly: day1, day2, or day3',
                        'Speaker ID must match an existing speaker',
                        'Time can be in any format (e.g., "10:00 - 11:00")',
                        'All fields are required for program creation'
                    ]
                ], 422);
            }

            $speaker = \App\Models\Speaker::find($validator->validated()['speaker_id']);
            return response()->json([
                'message' => 'Validation passed! Program data is ready for submission.',
                'data' => $validator->validated(),
                'speaker_info' => [
                    'id' => $speaker->id,
                    'name' => $speaker->name,
                    'job_title' => $speaker->job_title
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Validation error occurred',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    });
    
    // Speakers CRUD (Admin)
    Route::post('/speakers', [AdminSpeakerController::class, 'store']);
    Route::put('/speakers/{id}', [AdminSpeakerController::class, 'update']);
    Route::delete('/speakers/{id}', [AdminSpeakerController::class, 'destroy']);
    
    // Programs CRUD (Admin)
    Route::get('/admin/programs', [AdminProgramController::class, 'index']);
    Route::post('/programs', [AdminProgramController::class, 'store']);
    Route::put('/programs/{id}', [AdminProgramController::class, 'update']);
    Route::delete('/programs/{id}', [AdminProgramController::class, 'destroy']);
    
    // Reservations (Admin)
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    
    // QR Validation (Admin) - Higher rate limit for scanning
    Route::middleware('throttle:qr-scan')->group(function () {
        Route::post('/reservations/validate-qr', [ReservationController::class, 'validateQR']);
    });
    
    // Statistics (Admin)
    Route::get('/statistics', [ReservationController::class, 'statistics']);
    Route::get('/scan-statistics', [ReservationController::class, 'scanStatistics']);
    
    // Export (Admin)
    Route::get('/reservations/export', [ReservationController::class, 'export']);
});
