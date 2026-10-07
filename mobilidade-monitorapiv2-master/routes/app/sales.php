<?php

Route::group(['middleware' => 'auth:api'], function () {
    Route::group(['prefix' => 'sale'], function () {
        Route::get('', [\App\Http\Controllers\Sale\SaleTripController::class, 'index']);
        Route::post('', [\App\Http\Controllers\Sale\SaleTripController::class, 'store']);
        Route::delete('/{id}', [\App\Http\Controllers\Sale\SaleTripController::class, 'destroy']);
        Route::put('/{id}', [\App\Http\Controllers\Sale\SaleTripController::class, 'update']);
    });
});
