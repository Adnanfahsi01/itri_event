<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Seat Model
 * Represents a seat in the venue
 */
class Seat extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'seat_number',
        'block',
        'row_number',
        'seat_index',
        'type',
    ];

    /**
     * Get reservations for this seat
     */
    public function reservations()
    {
        return $this->belongsToMany(Reservation::class, 'reservation_seats')
            ->withPivot('day')
            ->withTimestamps();
    }
}
