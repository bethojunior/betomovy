<?php
/**
 * Created by PhpStorm.
 * User: Yuri e Dooug
 * Date: 12/01/2021
 * Time: 10:46
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {
    Route::group(['prefix' => 'asaas'], function () {
        Route::post('createBoleto', 'Asaas\AsaasController@createBoleto');
        Route::get('boletos/{id}', 'Asaas\AsaasController@getBoletos');
        Route::get('user/{id}', 'Asaas\AsaasController@getUser');
    });
});
