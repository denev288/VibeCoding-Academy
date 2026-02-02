<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ToolRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'tool_id',
        'role',
    ];

    protected $casts = [
        'role' => Role::class,
    ];

    public function tool(): BelongsTo
    {
        return $this->belongsTo(Tool::class);
    }
}
