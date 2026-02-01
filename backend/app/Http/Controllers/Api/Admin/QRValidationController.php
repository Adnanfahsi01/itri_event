<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

/**
 * QR Validation Controller
 * Handles QR code scanning and ticket validation
 */
class QRValidationController extends Controller
{
    /**
     * Validate a ticket by QR code
     * Checks if ticket exists, is valid, and hasn't been used
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validate(Request $request)
    {
        // Validate incoming data
        $request->validate([
            'qr_data' => 'required|string',
        ]);

        // Decode QR data
        $qrData = json_decode($request->input('qr_data'), true);
        
        if (!$qrData || !isset($qrData['ticket_code'])) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid QR code format'
            ], 400);
        }

        $ticketCode = $qrData['ticket_code'];

        // Find reservation by ticket code
        $reservation = Reservation::where('ticket_code', $ticketCode)->first();

        if (!$reservation) {
            return response()->json([
                'valid' => false,
                'status' => 'invalid',
                'message' => 'Ticket not found'
            ], 404);
        }

        // Check if ticket has already been used
        if ($reservation->is_used) {
            return response()->json([
                'valid' => false,
                'status' => 'already_used',
                'message' => 'This ticket has already been used',
                'reservation' => $reservation
            ], 422);
        }

        // Mark ticket as used
        $reservation->update(['is_used' => true]);

        return response()->json([
            'valid' => true,
            'status' => 'valid',
            'message' => 'Ticket is valid and has been marked as used',
            'reservation' => $reservation
        ]);
    }

    /**
     * Check ticket status without marking as used
     * 
     * @param string $ticketCode
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkStatus($ticketCode)
    {
        $reservation = Reservation::where('ticket_code', $ticketCode)->first();

        if (!$reservation) {
            return response()->json([
                'found' => false,
                'message' => 'Ticket not found'
            ], 404);
        }

        return response()->json([
            'found' => true,
            'is_used' => $reservation->is_used,
            'reservation' => $reservation
        ]);
    }
}
