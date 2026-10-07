<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/01/2020
 * Time: 17:05
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {

    /**
     * Rotas para clientes
     */
    Route::group(['prefix' => 'customer'], function () {
        Route::get('', 'User\CustomerController@findAll');
        Route::get('central', 'User\CustomerController@findAllCentralCustomers');
        Route::get('{id}', 'User\CustomerController@show');
        Route::get('criminal-record/{id}', 'User\CustomerController@criminalRecord');
        Route::put('{id}', 'User\CustomerController@edit');
        Route::post('{customerId}/block', 'User\CustomerController@block');
        Route::put('{customerId}/unlock', 'User\CustomerController@unlock');
        Route::post('{customerId}/profileImage', 'User\CustomerProfilePhotoController@upload');
        Route::post('{id}/validate-registration', 'User\CustomerController@validateRegistration');
        Route::get('{cityId}/locations' , 'User\CustomerController@findAllLocation');
    });
});
