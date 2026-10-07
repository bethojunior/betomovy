<?php

Route::group(['middleware' => 'auth:api'], function() {

    Route::group(['prefix' => 'publicitiesApp'], function () {
        
        Route::post('', 'PublicitiesApp\PublicitiesAppController@store');
        
        Route::get('', 'PublicitiesApp\PublicitiesAppController@index');
        
        Route::get('{id}', 'PublicitiesApp\PublicitiesAppController@show');
        
        Route::put('{id}', 'PublicitiesApp\PublicitiesAppController@update');
        
        Route::delete('{id}', 'PublicitiesApp\PublicitiesAppController@destroy');
    });
});
