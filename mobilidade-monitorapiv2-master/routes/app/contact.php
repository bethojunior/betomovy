<?php


Route::group(['middleware' => 'auth:api'], function () {
    Route::group(['prefix' => 'contactUs'], function () {
        Route::get('', 'Contact\ContactUsController@findAll');
    });
});

Route::group(['prefix' => 'audit'], function() {
    Route::get('', 'Audit\AuditController@findAll');
    Route::post('', 'Audit\AuditController@store');
    Route::delete('{id}', 'Audit\AuditController@delete');
});
