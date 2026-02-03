<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\AuditLogger;

class ToolAdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Tool::query()->with(['categories', 'tags', 'roleAssignments', 'creator']);

        if ($request->filled('category')) {
            $category = $request->query('category');
            $query->whereHas('categories', function ($builder) use ($category) {
                if (is_numeric($category)) {
                    $builder->where('categories.id', (int) $category);
                } else {
                    $builder->where('categories.slug', $category);
                }
            });
        }

        if ($request->filled('role')) {
            $role = $request->query('role');
            $query->whereHas('roleAssignments', function ($builder) use ($role) {
                $builder->where('role', $role);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $tools = $query->latest()->get();

        return response()->json($tools);
    }

    public function approve(Request $request, Tool $tool): JsonResponse
    {
        $tool->update(['status' => 'approved']);
        AuditLogger::log($request->user(), 'tool.approved', $tool, [
            'status' => 'approved',
        ], $request);

        return response()->json($tool);
    }

    public function reject(Request $request, Tool $tool): JsonResponse
    {
        $tool->update(['status' => 'rejected']);
        AuditLogger::log($request->user(), 'tool.rejected', $tool, [
            'status' => 'rejected',
        ], $request);

        return response()->json($tool);
    }
}
