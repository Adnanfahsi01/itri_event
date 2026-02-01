<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Speaker Model
 * Represents a speaker at the event
 */
class Speaker extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'job_title',
        'bio',
        'photo',
    ];

    /**
     * Get all programs/sessions for this speaker
     * One speaker can have multiple sessions
     */
    public function programs()
    {
        return $this->hasMany(Program::class);
    }
}
