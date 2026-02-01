<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Admin Authentication Controller
 * Handles admin login
 */
class AuthController extends Controller
{
    /**
     * Admin login
     * Validates credentials and returns admin data
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Validate incoming data
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find admin by email
        $admin = Admin::where('email', $request->email)->first();

        // Check if admin exists and password is correct
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Create token for admin (using Sanctum or similar)
        // For simplicity, we'll just return admin data
        // In production, you should use Laravel Sanctum tokens
        return response()->json([
            'message' => 'Login successful',
            'admin' => $admin,
            'token' => base64_encode($admin->id . ':' . time()) // Simple token (use Sanctum in production)
        ]);
    }

    /**
     * Get authenticated admin info
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request)
    {
        // In production, get admin from auth token
        // For now, we'll accept admin_id from request
        $adminId = $request->input('admin_id');
        
        $admin = Admin::find($adminId);
        
        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        return response()->json($admin);
    }

    /**
     * Admin logout
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // In production, revoke token
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
