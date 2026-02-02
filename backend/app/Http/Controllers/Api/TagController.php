<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Tag::query()->orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $slug = Str::slug($data['name']);

        $tag = Tag::firstOrCreate(
            ['slug' => $slug],
            ['name' => $data['name'], 'slug' => $slug]
        );

        return response()->json($tag, 201);
    }
}
