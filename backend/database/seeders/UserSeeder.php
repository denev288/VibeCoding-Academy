<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Иван Иванов',
                'email' => 'ivan@admin.local',
                'role' => Role::OWNER,
                'password' => 'password',
            ],
            [
                'name' => 'Елена Петрова',
                'email' => 'elena@frontend.local',
                'role' => Role::FRONTEND,
                'password' => 'password',
            ],
            [
                'name' => 'Петър Георгиев',
                'email' => 'petar@backend.local',
                'role' => Role::BACKEND,
                'password' => 'password',
            ],
            [
                'name' => 'Мария Стоянова',
                'email' => 'maria@pm.local',
                'role' => Role::PM,
                'password' => 'password',
            ],
            [
                'name' => 'Георги Николов',
                'email' => 'georgi@qa.local',
                'role' => Role::QA,
                'password' => 'password',
            ],
            [
                'name' => 'Анна Димитрова',
                'email' => 'anna@design.local',
                'role' => Role::DESIGNER,
                'password' => 'password',
            ],
        ];

        foreach ($users as $data) {
            User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'role' => $data['role'],
                    'password' => Hash::make($data['password']),
                ]
            );
        }
    }
}
