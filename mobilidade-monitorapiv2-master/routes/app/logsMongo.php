<?php

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {
    Route::group(['prefix' => 'mongoLogs'], function () {
        Route::post('', 'LogsMongo\LogsMongoController@getLogs');
        Route::post('/logsapplication', 'LogsMongo\LogsMongoController@getLogsApplication');
        Route::post('/logstransaction', 'LogsMongo\LogsMongoController@getTransactionLogs');
    });
});

