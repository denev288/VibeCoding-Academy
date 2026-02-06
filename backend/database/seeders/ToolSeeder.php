<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Tool;
use App\Models\ToolRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class ToolSeeder extends Seeder
{
    public function run(): void
    {
        $usersByRole = User::all()->keyBy(static fn (User $user) => $user->role->value);
        $owner = $usersByRole->get(Role::OWNER->value) ?? User::first();

        $categories = Category::all()->keyBy('name');
        $tags = Tag::all()->keyBy('name');

        $tools = [
            [
                'name' => 'Sprint Planner',
                'description' => 'Планиране на спринтове с цели, риск и зависимости.',
                'how_to_use' => 'Създай спринт, добави цели и екип.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::PM, Role::OWNER],
                'categories' => ['Management'],
                'tags' => ['planning', 'collaboration'],
                'created_by_role' => Role::PM,
            ],
            [
                'name' => 'QA Checklist Builder',
                'description' => 'Генерира чеклист за тестове.',
                'how_to_use' => 'Избери модул и стартирай.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::QA, Role::OWNER],
                'categories' => ['Testing'],
                'tags' => ['qa', 'automation'],
                'created_by_role' => Role::QA,
            ],
            [
                'name' => 'API Contract Mapper',
                'description' => 'Синхронизира API контракти.',
                'how_to_use' => 'Качи OpenAPI и сравни.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::BACKEND, Role::FRONTEND, Role::OWNER],
                'categories' => ['Development'],
                'tags' => ['backend', 'frontend', 'docs'],
                'created_by_role' => Role::BACKEND,
            ],
            [
                'name' => 'UX Flow Visualizer',
                'description' => 'Визуализира UX flow‑ове.',
                'how_to_use' => 'Добави стъпки и критични точки.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::DESIGNER, Role::PM, Role::OWNER],
                'categories' => ['Design'],
                'tags' => ['ui', 'planning'],
                'created_by_role' => Role::DESIGNER,
            ],
            [
                'name' => 'Release Notes Generator',
                'description' => 'Генерира release notes от промени.',
                'how_to_use' => 'Маркирай PR-и и версия.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::PM, Role::QA, Role::OWNER],
                'categories' => ['Management'],
                'tags' => ['docs', 'collaboration'],
                'created_by_role' => Role::PM,
            ],
            [
                'name' => 'Perf Budget Tracker',
                'description' => 'Следи performance budget.',
                'how_to_use' => 'Задай лимити и метрики.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::FRONTEND, Role::QA, Role::OWNER],
                'categories' => ['Testing'],
                'tags' => ['frontend', 'analytics'],
                'created_by_role' => Role::FRONTEND,
            ],
            [
                'name' => 'Schema Diff Watcher',
                'description' => 'Следи промени в schema.',
                'how_to_use' => 'Посочи база и график.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::BACKEND, Role::OWNER],
                'categories' => ['Development'],
                'tags' => ['backend', 'automation'],
                'created_by_role' => Role::BACKEND,
            ],
            [
                'name' => 'Test Data Synthesizer',
                'description' => 'Генерира тестови данни.',
                'how_to_use' => 'Избери сценарий и обем.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::QA, Role::OWNER],
                'categories' => ['Testing'],
                'tags' => ['qa', 'automation'],
                'created_by_role' => Role::QA,
            ],
            [
                'name' => 'Design Token Sync',
                'description' => 'Синхронизира дизайн токени.',
                'how_to_use' => 'Импортирай tokens и генерирай JSON.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::DESIGNER, Role::FRONTEND, Role::OWNER],
                'categories' => ['Design'],
                'tags' => ['ui', 'frontend'],
                'created_by_role' => Role::DESIGNER,
            ],
            [
                'name' => 'Risk Matrix Builder',
                'description' => 'Матрица риск/влияние.',
                'how_to_use' => 'Добави елементи и риск ниво.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::PM, Role::OWNER],
                'categories' => ['Management'],
                'tags' => ['planning'],
                'created_by_role' => Role::PM,
            ],
            [
                'name' => 'Security Checklist',
                'description' => 'Checklist за security проверки.',
                'how_to_use' => 'Избери среда и стартирай.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::BACKEND, Role::QA, Role::OWNER],
                'categories' => ['Security'],
                'tags' => ['security', 'qa'],
                'created_by_role' => Role::BACKEND,
            ],
            [
                'name' => 'Spec Reviewer',
                'description' => 'Преглед на спецификация.',
                'how_to_use' => 'Добави spec и критерии.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::PM, Role::QA, Role::OWNER],
                'categories' => ['Research'],
                'tags' => ['docs', 'qa'],
                'created_by_role' => Role::PM,
            ],
            [
                'name' => 'Frontend QA Matrix',
                'description' => 'Матрица за браузъри и устройства.',
                'how_to_use' => 'Избери устройства и checklist.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::FRONTEND, Role::QA, Role::OWNER],
                'categories' => ['Testing'],
                'tags' => ['frontend', 'qa'],
                'created_by_role' => Role::QA,
            ],
            [
                'name' => 'Stakeholder Update',
                'description' => 'Седмичен статус ъпдейт.',
                'how_to_use' => 'Избери проект и период.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::PM, Role::OWNER],
                'categories' => ['Management'],
                'tags' => ['planning', 'collaboration'],
                'created_by_role' => Role::PM,
            ],
            [
                'name' => 'API Regression Watch',
                'description' => 'Следи API регресии.',
                'how_to_use' => 'Импортирай baseline и сравни.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::BACKEND, Role::QA, Role::OWNER],
                'categories' => ['Testing'],
                'tags' => ['backend', 'qa'],
                'created_by_role' => Role::BACKEND,
            ],
            [
                'name' => 'Component Inventory',
                'description' => 'Инвентаризация на UI компоненти.',
                'how_to_use' => 'Сканирай репото и маркирай статус.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::DESIGNER, Role::FRONTEND, Role::OWNER],
                'categories' => ['Design'],
                'tags' => ['ui', 'frontend'],
                'created_by_role' => Role::FRONTEND,
            ],
        ];

        foreach ($tools as $data) {
            $creatorRole = $data['created_by_role'] ?? Role::OWNER;
            $creator = $usersByRole->get($creatorRole->value) ?? $owner;

            $tool = Tool::updateOrCreate(
                ['name' => $data['name']],
                [
                    'link' => $data['link'] ?? null,
                    'documentation_url' => $data['documentation_url'] ?? null,
                    'video_url' => $data['video_url'] ?? null,
                    'difficulty' => $data['difficulty'] ?? null,
                    'documentation' => $data['documentation'] ?? null,
                    'description' => $data['description'] ?? null,
                    'how_to_use' => $data['how_to_use'] ?? null,
                    'examples' => $data['examples'] ?? [],
                    'resource_links' => $data['resource_links'] ?? [],
                    'created_by' => $creator?->id,
                    'status' => $data['status'] ?? 'approved',
                ]
            );

            $categoryIds = [];
            foreach ($data['categories'] ?? [] as $name) {
                if ($categories->has($name)) {
                    $categoryIds[] = $categories->get($name)->id;
                }
            }
            if ($categoryIds) {
                $tool->categories()->sync($categoryIds);
            }

            $tagIds = [];
            foreach ($data['tags'] ?? [] as $name) {
                if ($tags->has($name)) {
                    $tagIds[] = $tags->get($name)->id;
                }
            }
            if ($tagIds) {
                $tool->tags()->sync($tagIds);
            }

            $roles = array_map(
                static fn ($role) => $role instanceof Role ? $role->value : (string) $role,
                $data['roles'] ?? []
            );

            if ($roles) {
                foreach ($roles as $role) {
                    ToolRole::updateOrCreate(
                        ['tool_id' => $tool->id, 'role' => $role],
                        []
                    );
                }

                ToolRole::where('tool_id', $tool->id)
                    ->whereNotIn('role', $roles)
                    ->delete();
            }
        }
    }
}
