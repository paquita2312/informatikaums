<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminFakultas extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            "name" => "Admin Fakultas",
            "email" => "fakultas@example.com",
            "role" => UserRole::Fakultas,
            "password" => Hash::make("admin123")
        ]);
    }
}
