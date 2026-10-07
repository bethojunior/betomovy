<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/09/2019
 * Time: 16:53
 */

Route::group(['middleware' => 'auth:api'], function() {
    /**
     * Items de frete
     */
    Route::group(['prefix' => 'item'], function () {
        Route::post('', 'Freight\ItemController@insert');
        Route::get('', 'Freight\ItemController@all');
        Route::post('{id}', 'Freight\ItemController@update');
        Route::delete('{id}', 'Freight\ItemController@delete');
    });
});
