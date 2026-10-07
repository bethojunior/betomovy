<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/10/2019
 * Time: 11:44
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {
    Route::group(['prefix' => 'monitoringArea'], function () {
        Route::post('', 'MonitoringArea\MonitoringAreaController@store');
        Route::get('', 'MonitoringArea\MonitoringAreaController@findByCity');
        Route::delete('{id}', 'MonitoringArea\MonitoringAreaController@delete');
        Route::put('{id}/enable', 'MonitoringArea\MonitoringAreaController@enable');
        Route::put('{id}/disable', 'MonitoringArea\MonitoringAreaController@disable');
        Route::put('{id}/update', 'MonitoringArea\MonitoringAreaController@update');
    });
});

