<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 13:03
 */

/*
|---------------------------------------------------------------------------
| Delivery Module
|---------------------------------------------------------------------------
*/
Route::get('/health-704-check', function () {
    return response()->json([
        'success' => true
    ], 200);
})
    ->middleware('api');

Route::middleware('api')
    ->group(base_path('routes/modules/delivery/company.php'));
Route::middleware('api')
    ->group(base_path('routes/modules/delivery/product.php'));
Route::middleware('api')
    ->group(base_path('routes/modules/delivery/order.php'));
Route::middleware('api')
    ->group(base_path('routes/modules/delivery/user.php'));
Route::middleware('api')
    ->group(base_path('routes/modules/delivery/neighborhood.php'));
Route::middleware('api')
    ->group(base_path('routes/modules/delivery/promotion.php'));
Route::middleware('api')
    ->group(base_path('routes/modules/delivery/section.php'));
