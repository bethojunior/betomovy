<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/09/2019
 * Time: 10:27
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {

    /**
     * Rotas para acessibilidade
     */
    Route::group(['prefix' => 'accessibility'], function () {
        Route::group(['prefix' => 'help'], function () {
            Route::get('', 'Accessibility\AccessibilityHelpController@findAll');
            Route::post('', 'Accessibility\AccessibilityHelpController@insert');
            Route::delete('{id}', 'Accessibility\AccessibilityHelpController@delete');
        });

        Route::group(['prefix' => 'obstacle'], function () {
            Route::get('', 'Accessibility\ObstacleOnFloorController@findAll');
            Route::post('', 'Accessibility\ObstacleOnFloorController@insert');
            Route::delete('{id}', 'Accessibility\ObstacleOnFloorController@delete');
        });
    });

    Route::group(['prefix' => 'price'], function () {
        Route::group(['prefix' => 'help'], function () {
            Route::get('', 'Price\PriceHelpController@findAll');
            Route::post('', 'Price\PriceHelpController@insert');
            Route::delete('{id}', 'Price\PriceHelpController@delete');
        });

        Route::group(['prefix' => 'obstacle'], function () {
            Route::get('', 'Price\PriceObstacleController@findAll');
            Route::post('', 'Price\PriceObstacleController@insert');
            Route::delete('{id}', 'Price\PriceObstacleController@delete');
        });
    });
});
