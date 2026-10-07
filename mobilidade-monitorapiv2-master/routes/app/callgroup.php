<?php

Route::group(['middleware' => 'auth:api'], function () {
    Route::group(['prefix' => 'callGroup'], function () {
        Route::get('', 'CallGroup\CallGroupController@findAll');
        Route::post('', 'CallGroup\CallGroupController@insert');
        Route::post('linkDriver', 'CallGroup\CallGroupController@linkDriver');
        Route::post('unlinkDriver', 'CallGroup\CallGroupController@unlinkDriver');
        Route::get('linkedDrivers/{id}', 'CallGroup\CallGroupController@findLinkedDrivers');
        Route::get('searchDriver', 'CallGroup\CallGroupController@searchDriverByName');
        Route::post('{id}', 'CallGroup\CallGroupController@update');
        Route::delete('{id}', 'CallGroup\CallGroupController@delete');
    });
});
