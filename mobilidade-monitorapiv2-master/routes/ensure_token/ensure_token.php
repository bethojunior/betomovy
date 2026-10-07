<?php

use Illuminate\Support\Facades\Route;

Route::group([], function () {
    Route::middleware('api')
        ->group(base_path('routes/ensure_token/webookservices.php'));
    Route::middleware('api')
        ->group(base_path('routes/ensure_token/configapppartners.php'));
    Route::middleware('api')
        ->group(base_path('routes/ensure_token/listcontacts.php'));
});
