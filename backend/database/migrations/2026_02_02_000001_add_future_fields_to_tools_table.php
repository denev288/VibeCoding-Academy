<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tools', function (Blueprint $table) {
            $table->string('video_url')->nullable()->after('documentation_url');
            $table->string('difficulty')->nullable()->after('video_url');
            $table->json('resource_links')->nullable()->after('examples');
        });
    }

    public function down(): void
    {
        Schema::table('tools', function (Blueprint $table) {
            $table->dropColumn(['video_url', 'difficulty', 'resource_links']);
        });
    }
};
