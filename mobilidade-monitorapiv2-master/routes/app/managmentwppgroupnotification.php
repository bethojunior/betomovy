<?php

/**
 * Created by ETERNAL ROMANCE: BJR
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {

    /**
     * Rotas para Gestores
     */
    Route::group(['prefix' => 'managementWppNotifications'], function () {
        Route::get('', 'Utils\ManagementWppGroupNotificationController@findAll');
        Route::get('{id}', 'Utils\ManagementWppGroupNotificationController@find');
        Route::post('', 'Utils\ManagementWppGroupNotificationController@store');
        Route::put('{id}', 'Utils\ManagementWppGroupNotificationController@update');
        Route::delete('{id}', 'Utils\ManagementWppGroupNotificationController@delete');
    });
});
