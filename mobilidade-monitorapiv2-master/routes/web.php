<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

Route::get('/healthy', function () {
    $status = [
        'app' => true,
        'mysql' => false,
        'mongo' => false,
        'timestamp' => now()->toDateTimeString(),
    ];

    try {
        DB::connection()->getPdo();
        $status['mysql'] = true;
    } catch (\Throwable $e) {
        $status['mysql_error'] = $e->getMessage();
    }

    try {
        Cache::put('health_check_test', true, 5);
        $status['mongo'] = Cache::get('health_check_test') === true;
    } catch (\Throwable $e) {
        $status['mongo_error'] = $e->getMessage();
    }

    $allUp = $status['app'] && $status['mysql'] && $status['mongo'];

    return response()->json([
        'status' => $allUp ? 'UP' : 'DOWN',
        'timestamp' => now()->toDateTimeString(),
        'services' => $status,
    ], $allUp ? 200 : 400);
});
