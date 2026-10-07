<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 14:39
 */

Route::group(['middleware' => 'auth:api'], function () {
    /**
     * Rotas para cliente
     */
    Route::group(['prefix' => 'customer'], function () {
        Route::get('', 'User\CustomerController@findByUser');
        Route::put('{id}/address', 'User\CustomerController@updateAddress');

        Route::post('asaas', 'User\CustomerController@createCustomerInAsaas');
    });
});

Route::get('getCardFlags', "Card\CardController@listCardFlags");

Route::get('driverAttachmentType', "Driver\DriverAttachmentTypeController@findAll");
