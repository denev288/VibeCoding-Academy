<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Tool;
use App\Models\ToolRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ToolController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Tool::query()->with(['categories', 'tags', 'roleAssignments', 'creator']);
        $user = $request->user();

        if ($user && $user->role !== Role::OWNER->value) {
            $query->whereHas('roleAssignments', function ($builder) use ($user) {
                $builder->where('role', $user->role);
            });
        }

        if ($request->filled('name')) {
            $name = strtolower($request->query('name'));
            $query->whereRaw('LOWER(name) LIKE ?', ['%'.$name.'%']);
        }

        if ($request->filled('role')) {
            $role = $request->query('role');
            $query->whereHas('roleAssignments', function ($builder) use ($role) {
                $builder->where('role', $role);
            });
        }

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

        if ($request->filled('tags')) {
            $tags = array_filter(explode(',', (string) $request->query('tags')));
            $tagIds = array_filter($tags, static fn ($tag) => is_numeric($tag));
            $tagSlugs = array_filter($tags, static fn ($tag) => !is_numeric($tag));
            $query->whereHas('tags', function ($builder) use ($tagIds, $tagSlugs) {
                $builder->where(function ($nested) use ($tagIds, $tagSlugs) {
                    if (!empty($tagIds)) {
                        $nested->orWhereIn('tags.id', array_map('intval', $tagIds));
                    }
                    if (!empty($tagSlugs)) {
                        $nested->orWhereIn('tags.slug', $tagSlugs);
                    }
                });
            });
        }

        $tools = $query->latest()->get();

        return response()->json($tools);
    }

    public function show(Request $request, Tool $tool): JsonResponse
    {
        $tool->load(['categories', 'tags', 'roleAssignments', 'creator']);
        $user = $request->user();

        if ($user && $user->role !== Role::OWNER->value) {
            $allowed = $tool->roleAssignments->contains('role', $user->role);
            if (!$allowed) {
                return response()->json(['message' => 'Нямате достъп до този инструмент.'], 403);
            }
        }

        return response()->json($tool);
    }

    public function store(Request $request): JsonResponse
    {
        $roles = array_map(static fn (Role $role) => $role->value, Role::cases());

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'link' => ['nullable', 'url'],
            'documentation_url' => ['nullable', 'url'],
            'video_url' => ['nullable', 'url'],
            'difficulty' => ['nullable', Rule::in(['beginner', 'intermediate', 'advanced'])],
            'documentation' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'how_to_use' => ['nullable', 'string'],
            'examples' => ['nullable', 'array'],
            'resource_links' => ['nullable', 'array'],
            'resource_links.*' => ['string', 'url'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'new_category' => ['nullable', 'string', 'max:255'],
            'role_keys' => ['nullable', 'array'],
            'role_keys.*' => ['string', Rule::in($roles)],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'new_tags' => ['nullable', 'array'],
            'new_tags.*' => ['string', 'max:255'],
        ]);

        $tool = Tool::create([
            'name' => $data['name'],
            'link' => $data['link'] ?? null,
            'documentation_url' => $data['documentation_url'] ?? null,
            'video_url' => $data['video_url'] ?? null,
            'difficulty' => $data['difficulty'] ?? null,
            'documentation' => $data['documentation'] ?? null,
            'description' => $data['description'] ?? null,
            'how_to_use' => $data['how_to_use'] ?? null,
            'examples' => $data['examples'] ?? null,
            'resource_links' => $data['resource_links'] ?? null,
            'created_by' => Auth::id(),
        ]);

        $categoryIds = $data['category_ids'] ?? [];
        if (!empty($data['new_category'])) {
            $slug = Str::slug($data['new_category']);
            $category = Category::firstOrCreate(
                ['slug' => $slug],
                ['name' => $data['new_category'], 'slug' => $slug]
            );
            $categoryIds[] = $category->id;
        }
        if (!empty($categoryIds)) {
            $tool->categories()->sync($categoryIds);
        }

        $tagIds = $data['tag_ids'] ?? [];
        if (!empty($data['new_tags'])) {
            foreach ($data['new_tags'] as $name) {
                $slug = Str::slug($name);
                $tag = Tag::firstOrCreate(['slug' => $slug], ['name' => $name, 'slug' => $slug]);
                $tagIds[] = $tag->id;
            }
        }
        if (!empty($tagIds)) {
            $tool->tags()->sync($tagIds);
        }

        $roleKeys = $data['role_keys'] ?? [];
        if (!in_array(Role::OWNER->value, $roleKeys, true)) {
            $roleKeys[] = Role::OWNER->value;
        }
        foreach ($roleKeys as $role) {
            ToolRole::create([
                'tool_id' => $tool->id,
                'role' => $role,
            ]);
        }

        return response()->json($tool->load(['categories', 'tags', 'roleAssignments']), 201);
    }

    public function update(Request $request, Tool $tool): JsonResponse
    {
        if ((int) $tool->created_by !== (int) Auth::id()) {
            return response()->json(['message' => 'Нямате права да редактирате този инструмент.'], 403);
        }

        $roles = array_map(static fn (Role $role) => $role->value, Role::cases());

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'link' => ['nullable', 'url'],
            'documentation_url' => ['nullable', 'url'],
            'video_url' => ['nullable', 'url'],
            'difficulty' => ['nullable', Rule::in(['beginner', 'intermediate', 'advanced'])],
            'documentation' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'how_to_use' => ['nullable', 'string'],
            'examples' => ['nullable', 'array'],
            'resource_links' => ['nullable', 'array'],
            'resource_links.*' => ['string', 'url'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'new_category' => ['nullable', 'string', 'max:255'],
            'role_keys' => ['nullable', 'array'],
            'role_keys.*' => ['string', Rule::in($roles)],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'new_tags' => ['nullable', 'array'],
            'new_tags.*' => ['string', 'max:255'],
        ]);

        $tool->fill($data);
        $tool->save();

        $categoryIds = $data['category_ids'] ?? [];
        if (!empty($data['new_category'])) {
            $slug = Str::slug($data['new_category']);
            $category = Category::firstOrCreate(
                ['slug' => $slug],
                ['name' => $data['new_category'], 'slug' => $slug]
            );
            $categoryIds[] = $category->id;
        }
        if (!empty($categoryIds)) {
            $tool->categories()->sync($categoryIds);
        }

        $tagIds = $data['tag_ids'] ?? [];
        if (!empty($data['new_tags'])) {
            foreach ($data['new_tags'] as $name) {
                $slug = Str::slug($name);
                $tag = Tag::firstOrCreate(['slug' => $slug], ['name' => $name, 'slug' => $slug]);
                $tagIds[] = $tag->id;
            }
        }
        if (!empty($tagIds)) {
            $tool->tags()->sync($tagIds);
        }

        if (array_key_exists('role_keys', $data)) {
            $roleKeys = $data['role_keys'] ?? [];
            if (!in_array(Role::OWNER->value, $roleKeys, true)) {
                $roleKeys[] = Role::OWNER->value;
            }
            $tool->roleAssignments()->delete();
            foreach ($roleKeys as $role) {
                ToolRole::create([
                    'tool_id' => $tool->id,
                    'role' => $role,
                ]);
            }
        }

        return response()->json($tool->load(['categories', 'tags', 'roleAssignments']));
    }

    public function destroy(Tool $tool): JsonResponse
    {
        if ((int) $tool->created_by !== (int) Auth::id()) {
            return response()->json(['message' => 'Нямате права да изтриете този инструмент.'], 403);
        }

        $tool->delete();

        return response()->json(['status' => 'deleted']);
    }
}
