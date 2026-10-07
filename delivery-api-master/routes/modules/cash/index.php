<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/07/2020
 * Time: 09:21
 */

/*
|---------------------------------------------------------------------------
| Cash Module
|---------------------------------------------------------------------------
*/
Route::middleware('api')
    ->group(base_path('routes/modules/cash/sale.php'));
Route::middleware('api')
    ->group(base_path('routes/modules/cash/transfer.php'));
Route::middleware('api')
    ->group(base_path('routes/modules/cash/general.php'));
