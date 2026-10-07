<?php

Route::group(['middleware' => 'auth:api'], function () {
    Route::group(['prefix' => 'establishmentCollectionManagement'], function () {
        Route::get('', 'Establishment\EstablishmentCollectionManagementController@findAll');
        Route::get('{id}', 'Establishment\EstablishmentCollectionManagementController@find');
        Route::get('{id}/companies', 'Establishment\EstablishmentCollectionManagementController@getCompaniesById');
        Route::post('', 'Establishment\EstablishmentCollectionManagementController@save');
        Route::delete('{id}', 'Establishment\EstablishmentCollectionManagementController@delete');
    });

    Route::group(['prefix' => 'establishmentBilling'], function () {
        Route::post('', 'Establishment\EstablishmentBillingController@create');
        Route::get('', 'Establishment\EstablishmentBillingController@findAll');
        Route::delete('{id}', 'Establishment\EstablishmentBillingController@delete');
        Route::put('{id}/confirm', 'Establishment\EstablishmentBillingController@confirmPayment');
        Route::put('{id}/refuse', 'Establishment\EstablishmentBillingController@refusePayment');
    });
});
