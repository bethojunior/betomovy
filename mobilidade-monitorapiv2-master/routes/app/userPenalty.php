<?php


Route::group(['middleware' => 'auth:api'], function () {
    Route::group(['prefix' => 'userPenaltiesType'], function () {
        Route::get('', 'User\UserPenaltiesTypeController@findAll');
        Route::put('{userPenaltiesType}', 'User\UserPenaltiesTypeController@update');
    });
});
