<?php
/**
 * Created by PhpStorm.
 * User: Luid Sousa
 * Date: 12/01/2021
 * Time: 10:46
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {
    Route::group(['prefix' => 'appVersion'], function () {
        Route::get('', 'App\AppVersionController@index');
        Route::get('getAll', 'App\AppVersionController@getAll');
        Route::get('app/{id}', 'App\AppVersionController@getAnaVersionById');
        Route::post('', 'App\AppVersionController@store');
        Route::get('{id}', 'App\AppVersionController@version');
        Route::put('{id}', 'App\AppVersionController@update');
    });

    Route::group(['prefix' => 'appModule'], function () {
        Route::get('', 'App\AppModuleController@index');
        Route::post('update', 'App\AppModuleController@update');
    });

    Route::group(['prefix' => 'menuApp'], function () {
       Route::post(''           , 'App\MenuAppController@insert');
       Route::post('insertPro'           , 'App\MenuAppController@insertPro');
       Route::get(''            , 'App\MenuAppController@findActives');
       Route::get('getPro'            , 'App\MenuAppController@findActivesPro');
       Route::put('{id}/disable', 'App\MenuAppController@disable');
       Route::get('types'       , 'App\MenuAppTypeController@findAll');
    });

    Route::group(['prefix' => 'appConfig'], function () {
        Route::post('', 'Config\AppConfigController@store');
        Route::get('', 'Config\AppConfigController@findAll');
        Route::delete('{id}', 'Config\AppConfigController@delete');
        Route::post('defaultLogo', 'Config\AppConfigController@storeDefaultLogo');
    });



    Route::group(['prefix' => 'appAnimation'], function () {
        Route::get('', 'App\AppAnimationController@index');
        Route::put('', 'App\AppAnimationController@update');
    });

});

