<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seat;
use Illuminate\Http\Request;

/**
 * Seat Controller
 * Handles seat availability and management
 */
class SeatController extends Controller
{
    /**
     * Get all seats for a specific day
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByDay(Request $request)
    {
        $day = $request->input('day', 'Day 1');
        
        $seats = Seat::where('day', $day)
            ->orderBy('seat_number')
            ->get();
            
        return response()->json($seats);
    }

    /**
     * Get seat availability status
     * 
     * @param string $seatNumber
     * @param string $day
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkAvailability($seatNumber, $day)
    {
        $seat = Seat::where('seat_number', $seatNumber)
            ->where('day', $day)
            ->first();
            
        if (!$seat) {
            return response()->json([
                'available' => false,
                'message' => 'Seat not found'
            ], 404);
        }

        return response()->json([
            'available' => $seat->is_available,
            'type' => $seat->type
        ]);
    }

    /**
     * Initialize seats for all days (admin only)
     * Creates 100 seats (10x10 grid) for each day
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function initializeSeats()
    {
        $days = ['Day 1', 'Day 2', 'Day 3'];
        $rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        $columns = range(1, 10);
        
        foreach ($days as $day) {
            foreach ($rows as $rowIndex => $row) {
                foreach ($columns as $col) {
                    $seatNumber = $row . $col;
                    
                    // Make first row (A) VIP seats
                    $type = ($row === 'A') ? 'VIP' : 'Regular';
                    
                    Seat::updateOrCreate(
                        [
                            'seat_number' => $seatNumber,
                            'day' => $day
                        ],
                        [
                            'type' => $type,
                            'is_available' => true
                        ]
                    );
                }
            }
        }

        return response()->json([
            'message' => 'Seats initialized successfully',
            'total_seats' => 300 // 100 seats per day × 3 days
        ]);
    }
}
