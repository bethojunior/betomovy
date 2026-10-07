<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/09/2019
 * Time: 16:53
 */

Route::group(['middleware' => 'auth:api'], function() {

    /**
     * Rotas de cidade
     */
    Route::group(['prefix' => 'city'], function (){
        Route::get('actives', 'Locale\CityController@actives');
        Route::get('actives/fully', 'Locale\CityController@activesFully');
        Route::post('mirroring', 'Locale\CityController@mirror');
        Route::get('{id}/tripTypes', 'Locale\CityController@getTripTypes');
        Route::put('{id}', 'Locale\CityController@editCityShortName');

        /**
         * Rotas de configurações de cidade
         */
        Route::get('{id}/config', 'Config\CityConfigController@findByCity');
        Route::put('{id}/config', 'Config\CityConfigController@update');
        Route::post('{id}/config', 'Config\CityConfigController@insert');

        /**
         * Rotas de raio de chamamento
         */
        Route::group(['prefix' => '{cityId}/zone'], function (){
            Route::post('', 'Config\ZoneController@store');
            Route::get('', 'Config\ZoneController@findByCity');
            Route::put('{zone_id}', 'Config\ZoneController@update');
        });

        Route::group(['prefix' => '{city}/area'], function (){
            Route::post('', 'Locale\CityAreaController@store');
            Route::put('', 'Locale\CityAreaController@updateArea');
        });

        Route::get('{id}', 'Locale\CityController@find');
        Route::get('locale/{id}', 'Locale\CityController@findLocale');
        Route::post('', 'Locale\CityController@store');
        Route::put('{city}', 'Locale\CityController@update');
        Route::delete('{city}', 'Locale\CityController@delete');
        Route::delete('{city}/delete/cityName', 'Locale\CityController@deleteCityName');
    });
});
