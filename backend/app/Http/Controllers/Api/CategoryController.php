<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use App\Services\AuditLogger;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Cache::remember('categories.all', 300, function () {
            return Category::query()->orderBy('name')->get();
        });

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $slug = Str::slug($data['name']);

        $category = Category::firstOrCreate(
            ['slug' => $slug],
            ['name' => $data['name'], 'slug' => $slug]
        );

        Cache::forget('categories.all');
        AuditLogger::log($request->user(), 'category.created', $category, [
            'name' => $category->name,
        ], $request);

        return response()->json($category, 201);
    }
}
