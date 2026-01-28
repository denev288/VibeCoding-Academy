<?php

declare(strict_types=1);

namespace App\Enums;

enum Role: string
{
    case OWNER = 'owner';
    case BACKEND = 'backend';
    case FRONTEND = 'frontend';
    case PM = 'pm';
    case QA = 'qa';
    case DESIGNER = 'designer';
}
