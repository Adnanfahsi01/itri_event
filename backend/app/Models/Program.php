<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Program Model
 * Represents a session/program in the event schedule
 */
class Program extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'day',
        'time',
        'speaker_id',
    ];

    /**
     * Get the speaker for this program
     * Each program belongs to one speaker
     */
    public function speaker()
    {
        return $this->belongsTo(Speaker::class);
    }
}
