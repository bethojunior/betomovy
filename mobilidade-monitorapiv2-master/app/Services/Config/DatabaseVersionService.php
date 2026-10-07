<?php


namespace App\Services\Config;


use App\Models\Config\AppDatabaseVersion;
use Cache;

class DatabaseVersionService
{
    public function get()
    {
        return Cache::remember('database_version', 360, function () {
            return AppDatabaseVersion::latest()->orderByDesc('id')->first();
        });
    }
}
