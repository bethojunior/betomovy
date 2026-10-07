<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/10/2019
 * Time: 11:44
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {

    /**
     * Rotas para tarifas
     */
    Route::group(['prefix' => 'price'], function () {
        Route::group(['prefix' => 'dynamic'], function () {
            Route::get('', 'Price\Dynamic\PriceDynamicController@findAll');
            Route::post('', 'Price\Dynamic\PriceDynamicController@insert');
            Route::put('{id}/enable', 'Price\Dynamic\PriceDynamicController@enable');
            Route::put('{id}/disable', 'Price\Dynamic\PriceDynamicController@disable');
            Route::get('{id}/show', 'Price\Dynamic\PriceDynamicController@show');
            Route::put('{id}/update', 'Price\Dynamic\PriceDynamicController@update');
            Route::delete('{id}', 'Price\Dynamic\PriceDynamicController@delete');
        });

        Route::group(['prefix' => 'range'], function () {
            Route::get('', 'Price\Range\PriceRangeController@findAll');
            Route::post('', 'Price\Range\PriceRangeController@insert');
            Route::delete('{id}', 'Price\Range\PriceRangeController@delete');
            Route::put('{id}', 'Price\Range\PriceRangeController@update');
        });

        Route::get('', 'Central\PriceController@findAll');
        Route::post('', 'Central\PriceController@store');
        Route::delete('{price_id}', 'Central\PriceController@delete');
        Route::put('update-order', 'Central\PriceController@updateOrder');
    });

    /**
     * Rotas para comissão do motoristas
     */
    Route::group(['prefix' => 'driverCommission'], function () {
        Route::get('{cityId}', 'Price\DriverCommission\DriverCommissionController@getAllByCity');
        Route::post('{cityId}', 'Price\DriverCommission\DriverCommissionController@store');
    });

    Route::group(['prefix' => 'priceDynamicScheduled'], function () {
        Route::get('', 'Price\Dynamic\PriceDynamicScheduledController@findAll');
        Route::post('', 'Price\Dynamic\PriceDynamicScheduledController@store');
        Route::get('{priceDynamicScheduled}/show', 'Price\Dynamic\PriceDynamicScheduledController@show');
        Route::put('{priceDynamicScheduled}/update', 'Price\Dynamic\PriceDynamicScheduledController@update');
        Route::delete('{priceDynamicScheduled}', 'Price\Dynamic\PriceDynamicScheduledController@delete');
    });

    Route::group(['prefix' => 'dynamicArea'], function () {
        Route::post('', 'Price\Dynamic\DynamicAreaController@store');
        Route::get('', 'Price\Dynamic\DynamicAreaController@findByCity');
        Route::delete('{id}', 'Price\Dynamic\DynamicAreaController@delete');
        Route::put('{id}/enable', 'Price\Dynamic\DynamicAreaController@enable');
        Route::put('{id}/disable', 'Price\Dynamic\DynamicAreaController@disable');
        Route::put('{id}/update', 'Price\Dynamic\DynamicAreaController@update');
    });
});
