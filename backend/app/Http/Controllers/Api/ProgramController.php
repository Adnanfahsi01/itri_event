<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ProgramController extends Controller
{
    /**
     * Get all programs
     */
    public function index()
    {
        try {
            $pdo = \DB::connection()->getPdo();
            $stmt = $pdo->query("
                SELECT p.*, s.name as speaker_name, s.job_title
                FROM programs p
                LEFT JOIN speakers s ON p.speaker_id = s.id
                ORDER BY p.created_at DESC
            ");
            $programs = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            return response()->json([
                'success' => true,
                'data' => $programs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get programs by day
     */
    public function getByDay(Request $request)
    {
        try {
            $day = $request->query('day');
            
            $pdo = \DB::connection()->getPdo();
            $stmt = $pdo->prepare("
                SELECT p.*, s.name as speaker_name, s.job_title
                FROM programs p
                LEFT JOIN speakers s ON p.speaker_id = s.id
                WHERE p.day = ?
                ORDER BY p.time ASC
            ");
            $stmt->execute([$day]);
            $programs = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            return response()->json([
                'success' => true,
                'data' => $programs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single program
     */
    public function show($id)
    {
        try {
            $pdo = \DB::connection()->getPdo();
            $stmt = $pdo->prepare("
                SELECT p.*, s.name as speaker_name, s.job_title, s.bio
                FROM programs p
                LEFT JOIN speakers s ON p.speaker_id = s.id
                WHERE p.id = ?
            ");
            $stmt->execute([$id]);
            $program = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            if (!$program) {
                return response()->json([
                    'success' => false,
                    'message' => 'Program not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $program
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new program (Admin)
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'day' => 'required|string',
                'time' => 'required|string',
                'speaker_id' => 'nullable|integer',
            ]);

            $pdo = \DB::connection()->getPdo();
            $stmt = $pdo->prepare("
                INSERT INTO programs (title, day, time, speaker_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, NOW(), NOW())
            ");
            $stmt->execute([
                $validated['title'],
                $validated['day'],
                $validated['time'],
                $validated['speaker_id'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Program created successfully',
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
     * Update program (Admin)
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'day' => 'required|string',
                'time' => 'required|string',
                'speaker_id' => 'nullable|integer',
            ]);

            $pdo = \DB::connection()->getPdo();
            $stmt = $pdo->prepare("
                UPDATE programs 
                SET title = ?, day = ?, time = ?, speaker_id = ?, updated_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([
                $validated['title'],
                $validated['day'],
                $validated['time'],
                $validated['speaker_id'] ?? null,
                $id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Program updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete program (Admin)
     */
    public function destroy($id)
    {
        try {
            $pdo = \DB::connection()->getPdo();
            $stmt = $pdo->prepare("DELETE FROM programs WHERE id = ?");
            $stmt->execute([$id]);

            return response()->json([
                'success' => true,
                'message' => 'Program deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
