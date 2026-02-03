<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Tool;
use App\Models\ToolActionChallenge;
use App\Models\ToolRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use App\Services\AuditLogger;

class ToolController extends Controller
{
    private function roleValue($user): ?string
    {
        if (!$user) {
            return null;
        }
        return $user->role instanceof Role ? $user->role->value : $user->role;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Tool::query()->with(['categories', 'tags', 'roleAssignments', 'creator']);
        $user = $request->user();
        $roleValue = $this->roleValue($user);

        if ($user && $roleValue !== Role::OWNER->value) {
            $query->where(function ($builder) use ($roleValue, $user) {
                $builder
                    ->where(function ($inner) use ($roleValue) {
                        $inner->whereHas('roleAssignments', function ($roleBuilder) use ($roleValue) {
                            $roleBuilder->where('role', $roleValue);
                        })
                        ->where('status', 'approved');
                    })
                    ->orWhere(function ($inner) use ($user) {
                        $inner->where('created_by', $user->id)
                            ->whereIn('status', ['pending', 'rejected']);
                    });
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

    public function count(): JsonResponse
    {
        $count = Cache::remember('tools.count', 300, function () {
            return Tool::query()->count();
        });

        return response()->json(['count' => $count]);
    }

    public function show(Request $request, Tool $tool): JsonResponse
    {
        $tool->load(['categories', 'tags', 'roleAssignments', 'creator']);
        $user = $request->user();
        $roleValue = $this->roleValue($user);

        if ($user && $roleValue !== Role::OWNER->value) {
            $allowed = $tool->roleAssignments->contains('role', $roleValue);
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
            'status' => 'pending',
        ]);

        Cache::forget('tools.count');

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

        AuditLogger::log($request->user(), 'tool.created', $tool, [
            'name' => $tool->name,
            'status' => $tool->status,
        ], $request);

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

        AuditLogger::log($request->user(), 'tool.updated', $tool, [
            'name' => $tool->name,
            'status' => $tool->status,
        ], $request);

        return response()->json($tool->load(['categories', 'tags', 'roleAssignments']));
    }

    public function destroy(Request $request, Tool $tool): JsonResponse
    {
        if ((int) $tool->created_by !== (int) Auth::id()) {
            return response()->json(['message' => 'Нямате права да изтриете този инструмент.'], 403);
        }

        AuditLogger::log($request->user(), 'tool.deleted', $tool, [
            'name' => $tool->name,
            'status' => $tool->status,
        ], $request);

        $tool->delete();

        Cache::forget('tools.count');

        return response()->json(['status' => 'deleted']);
    }

    public function requestDeleteCode(Request $request, Tool $tool): JsonResponse
    {
        if ((int) $tool->created_by !== (int) Auth::id()) {
            return response()->json(['message' => 'Нямате права да изтриете този инструмент.'], 403);
        }

        $user = $request->user();
        $data = $request->validate([
            'email' => ['nullable', 'email'],
        ]);
        $targetEmail = $data['email'] ?? $user->email;
        $code = (string) random_int(100000, 999999);

        ToolActionChallenge::where('user_id', $user->id)
            ->where('tool_id', $tool->id)
            ->where('action', 'delete_tool')
            ->whereNull('consumed_at')
            ->delete();

        ToolActionChallenge::create([
            'user_id' => $user->id,
            'tool_id' => $tool->id,
            'action' => 'delete_tool',
            'code_hash' => Hash::make($code),
            'expires_at' => now()->addMinutes(10),
            'attempts' => 0,
            'max_attempts' => 5,
        ]);

        Mail::raw(
            "Код за изтриване на инструмент \"{$tool->name}\": {$code}\nВалиден 10 минути.",
            static function ($message) use ($targetEmail) {
                $message->to($targetEmail)->subject('Код за потвърждение (изтриване)');
            }
        );

        return response()->json(['status' => 'sent']);
    }

    public function confirmDelete(Request $request, Tool $tool): JsonResponse
    {
        if ((int) $tool->created_by !== (int) Auth::id()) {
            return response()->json(['message' => 'Нямате права да изтриете този инструмент.'], 403);
        }

        $data = $request->validate([
            'code' => ['required', 'string'],
        ]);

        $challenge = ToolActionChallenge::where('user_id', Auth::id())
            ->where('tool_id', $tool->id)
            ->where('action', 'delete_tool')
            ->whereNull('consumed_at')
            ->latest()
            ->first();

        if (!$challenge) {
            return response()->json(['message' => 'Няма активен код за потвърждение.'], 422);
        }

        if ($challenge->expires_at->isPast()) {
            return response()->json(['message' => 'Кодът е изтекъл.'], 422);
        }

        if ($challenge->attempts >= $challenge->max_attempts) {
            return response()->json(['message' => 'Прекалено много опити.'], 429);
        }

        if (!Hash::check($data['code'], $challenge->code_hash)) {
            $challenge->increment('attempts');
            return response()->json(['message' => 'Невалиден код.'], 422);
        }

        $challenge->update(['consumed_at' => now()]);
        $tool->delete();

        return response()->json(['status' => 'deleted']);
    }
}
