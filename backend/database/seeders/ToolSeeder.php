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
use Illuminate\Support\Str;

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
                'description' => 'Планиране на спринтове с цели, риск и dependency карта.',
                'how_to_use' => 'Създай спринт, добави цели и маркирай зависимости.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::PM, Role::OWNER],
                'categories' => ['Management'],
                'tags' => ['planning', 'collaboration'],
                'created_by_role' => Role::PM,
            ],
            [
                'name' => 'QA Checklist Builder',
                'description' => 'Генерира чеклист за тестове на база модул и риск.',
                'how_to_use' => 'Избери модул, добави риск ниво и генерирай.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::QA, Role::OWNER],
                'categories' => ['Testing'],
                'tags' => ['qa', 'automation'],
                'created_by_role' => Role::QA,
            ],
            [
                'name' => 'API Contract Mapper',
                'description' => 'Синхронизира API контракти между бекенд и фронтенд.',
                'how_to_use' => 'Качи OpenAPI и сравни със frontend payloads.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::BACKEND, Role::FRONTEND, Role::OWNER],
                'categories' => ['Development'],
                'tags' => ['backend', 'frontend', 'docs'],
                'created_by_role' => Role::BACKEND,
            ],
            [
                'name' => 'UX Flow Visualizer',
                'description' => 'Визуализира потребителски flow‑ове и критични точки.',
                'how_to_use' => 'Добави стъпки и отбележи критични екрани.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::DESIGNER, Role::PM, Role::OWNER],
                'categories' => ['Design'],
                'tags' => ['ui', 'planning'],
                'created_by_role' => Role::DESIGNER,
            ],
            [
                'name' => 'Release Notes Generator',
                'description' => 'Автоматично събира промени и генерира release notes.',
                'how_to_use' => 'Маркирай PR-и и избери версия.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::PM, Role::QA, Role::OWNER],
                'categories' => ['Management'],
                'tags' => ['docs', 'collaboration'],
                'created_by_role' => Role::PM,
            ],
            [
                'name' => 'Perf Budget Tracker',
                'description' => 'Следи performance budget и алармира при регрес.',
                'how_to_use' => 'Задай лимити и добави metrics.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::FRONTEND, Role::QA, Role::OWNER],
                'categories' => ['Testing'],
                'tags' => ['frontend', 'analytics'],
                'created_by_role' => Role::FRONTEND,
            ],
            [
                'name' => 'Schema Diff Watcher',
                'description' => 'Следи промени в schema и уведомява екипа.',
                'how_to_use' => 'Посочи база и schedule за diff.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::BACKEND, Role::OWNER],
                'categories' => ['Development'],
                'tags' => ['backend', 'automation'],
                'created_by_role' => Role::BACKEND,
            ],
            [
                'name' => 'Test Data Synthesizer',
                'description' => 'Генерира синтетични данни за QA сценарии.',
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
                'description' => 'Синхронизира дизайн токени към codebase.',
                'how_to_use' => 'Импортирай Figma tokens и генерирай JSON.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::DESIGNER, Role::FRONTEND, Role::OWNER],
                'categories' => ['Design'],
                'tags' => ['ui', 'frontend'],
                'created_by_role' => Role::DESIGNER,
            ],
            [
                'name' => 'Risk Matrix Builder',
                'description' => 'Матрица риск/влияние за PM решения.',
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
                'description' => 'Checklist за базови security проверки.',
                'how_to_use' => 'Избери среда и стартирай проверка.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::BACKEND, Role::QA, Role::OWNER],
                'categories' => ['Security'],
                'tags' => ['security', 'qa'],
                'created_by_role' => Role::BACKEND,
            ],
            [
                'name' => 'Spec Reviewer',
                'description' => 'Преглед на спецификация спрямо acceptance criteria.',
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
                'description' => 'Автоматичен седмичен статус ъпдейт.',
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
                'description' => 'Следи API регресии с snapshot сравнение.',
                'how_to_use' => 'Импортирай baseline и пусни сравнение.',
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
            [
                'name' => 'Research Summarizer',
                'description' => 'Резюмира research и извежда ключови изводи.',
                'how_to_use' => 'Качи документ и избери дължина.',
                'difficulty' => 'easy',
                'status' => 'approved',
                'roles' => [Role::PM, Role::DESIGNER, Role::OWNER],
                'categories' => ['Research'],
                'tags' => ['docs'],
                'created_by_role' => Role::DESIGNER,
            ],
            [
                'name' => 'Backlog Groomer',
                'description' => 'Помага за приоритизация и чистене на backlog.',
                'how_to_use' => 'Импортирай backlog и критерии.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::PM, Role::OWNER],
                'categories' => ['Management'],
                'tags' => ['planning'],
                'created_by_role' => Role::PM,
            ],
            [
                'name' => 'Visual QA Diff',
                'description' => 'Сравнява визуални screenshot-и между версии.',
                'how_to_use' => 'Качи baseline и нови снимки.',
                'difficulty' => 'medium',
                'status' => 'approved',
                'roles' => [Role::QA, Role::DESIGNER, Role::OWNER],
                'categories' => ['Testing'],
                'tags' => ['qa', 'ui'],
                'created_by_role' => Role::QA,
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
