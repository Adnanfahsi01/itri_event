<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class SpeakerController extends Controller
{
    /**
     * Get all speakers
     */
    public function index()
    {
        try {
            $pdo = \DB::connection()->getPdo();
            $stmt = $pdo->query("SELECT * FROM speakers ORDER BY id DESC");
            $speakers = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            return response()->json([
                'success' => true,
                'data' => $speakers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single speaker
     */
    public function show($id)
    {
        try {
            $pdo = \DB::connection()->getPdo();
            $stmt = $pdo->prepare("SELECT * FROM speakers WHERE id = ?");
            $stmt->execute([$id]);
            $speaker = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            if (!$speaker) {
                return response()->json([
                    'success' => false,
                    'message' => 'Speaker not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $speaker
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new speaker (Admin)
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'job_title' => 'required|string|max:255',
                'bio' => 'nullable|string',
                'photo' => 'nullable|image|max:2048',
            ]);

            $pdo = \DB::connection()->getPdo();
            $stmt = $pdo->prepare("
                INSERT INTO speakers (name, job_title, bio, created_at, updated_at)
                VALUES (?, ?, ?, NOW(), NOW())
            ");
            $stmt->execute([
                $validated['name'],
                $validated['job_title'],
                $validated['bio'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Speaker created successfully',
                'id' => $pdo->lastInsertId()
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update speaker (Admin)
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'job_title' => 'required|string|max:255',
                'bio' => 'nullable|string',
            ]);

            $pdo = \DB::connection()->getPdo();
            $stmt = $pdo->prepare("
                UPDATE speakers 
                SET name = ?, job_title = ?, bio = ?, updated_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([
                $validated['name'],
                $validated['job_title'],
                $validated['bio'] ?? null,
                $id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Speaker updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete speaker (Admin)
     */
    public function destroy($id)
    {
        try {
            $pdo = \DB::connection()->getPdo();
            $stmt = $pdo->prepare("DELETE FROM speakers WHERE id = ?");
            $stmt->execute([$id]);

            return response()->json([
                'success' => true,
                'message' => 'Speaker deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
