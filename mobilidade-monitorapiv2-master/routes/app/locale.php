<?php
/**
 * Created by PhpStorm.
 * User: Luid Sousa
 * Date: 05/11/2020
 * Time: 16:53
 */

Route::group(['middleware' => 'auth:api'], function() {

    /**
     * Rotas de pais
     */
    Route::group(['prefix' => 'country'], function (){
        Route::get('', 'Locale\CountryController@findAll');
        Route::get('{id}', 'Locale\CountryController@find');
        Route::post('', 'Locale\CountryController@store');
        Route::put('{id}', 'Locale\CountryController@update');
        Route::delete('{id}', 'Locale\CountryController@delete');
    });

    /**
     * Rotas de estado
     */
    Route::group(['prefix' => 'estate'], function (){
        Route::get('{id}', 'Locale\EstateController@all');
        Route::get('{id}', 'Locale\EstateController@find');
        Route::post('', 'Locale\EstateController@store');
        Route::put('{id}', 'Locale\EstateController@update');
        Route::delete('{id}', 'Locale\EstateController@delete');
        Route::get('country/{id}', 'Locale\EstateController@getEstatesByCountryId');
    });
});
