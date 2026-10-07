<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/06/2020
 * Time: 15:19
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {
    Route::group(['prefix' => 'central'], function () {
        Route::group(['prefix' => 'priceRange'], function () {
            Route::get('', 'Central\PriceRangeCentralController@findAll');
            Route::post('', 'Central\PriceRangeCentralController@insert');
            Route::delete('{id}', 'Central\PriceRangeCentralController@delete');
        });

        Route::group(['prefix' => 'fee'], function () {
            Route::post('', 'Central\CentralFeeController@store');
            Route::get('', 'Central\CentralFeeController@find');
        });


        Route::group(['prefix' => 'neighborhood'], function () {
            Route::post('', 'Central\NeighborhoodController@store');
            Route::get('', 'Central\NeighborhoodController@findAll');
            Route::delete('{id}', 'Central\NeighborhoodController@delete');
        });

        Route::group(['prefix' => 'balance'], function () {
            Route::post('', 'Central\CentralController@balance');
        });

        Route::get('', 'Central\CentralController@index');
        Route::post('', 'Central\CentralController@store');
        Route::get('centralCallDriver', 'Central\CentralController@centralCallDriver');
        Route::get('{id}', 'Central\CentralController@find');
        Route::put('{central}', 'Central\CentralController@update');
        Route::delete('{central}', 'Central\CentralController@delete');

        Route::group(['prefix' => '{central}'], function () {
            Route::put('block', 'Central\CentralController@block');
            Route::put('activate', 'Central\CentralController@activate');
        });

        Route::group(['prefix' => 'user'], function () {
            Route::post('insert', 'Central\CentralUserController@insertUser');
            Route::get('eligible', 'Central\CentralUserController@eligible');
            Route::get('{id}', 'Central\CentralUserController@findUsersByCentral');
        });

        Route::group(['prefix' => 'voucherPurchasePayment'], function () {
            Route::get('findAll', 'Central\CentralVoucherPurchasePaymentController@findAll');
            Route::put('updatePaymentForm', 'Central\CentralVoucherPurchasePaymentController@updatePaymentForm');
        });

        Route::group(['prefix' => 'centralCallTypes'], function () {
            Route::get('findAll', 'Central\CentralController@findAllCentralCallTypes');
            Route::put('update', 'Central\CentralController@updateCentralCallTypes');
        });

    });
});
