<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/09/2019
 * Time: 10:57
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {

    /**
     * Rotas para Gestores
     */
    Route::group(['prefix' => 'manager'], function () {
        Route::get('', 'Manager\ManagerController@getAllManagers');
        Route::post('', 'Manager\ManagerController@store');
        Route::get('{userId}/drivers', 'Manager\ManagerController@getDriversByManager');
        Route::delete('{id}', 'Manager\ManagerController@removeManager');
        Route::get('{id}', 'Manager\ManagerController@getManager');
        Route::put('{id}', 'Manager\ManagerController@update');
        Route::get('select/all', 'Manager\ManagerController@getAllManagersSelect');
        Route::get('{id}/user', 'Manager\ManagerController@verifyUserIsManager');
    });
});
