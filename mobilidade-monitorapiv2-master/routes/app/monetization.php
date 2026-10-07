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
     * Rotas para monetização por indicação
     */
    Route::group(['prefix' => 'referralMonetization'], function () {
        Route::post('', 'Monetization\ReferralMonetizationController@insert');
        Route::get('', 'Monetization\ReferralMonetizationController@findAll');
        Route::put('{id}', 'Monetization\ReferralMonetizationController@update');
        Route::delete('{id}', 'Monetization\ReferralMonetizationController@delete');
    });

    /**
     * Rotas para cashback
     */
    Route::group(['prefix' => 'cashback'], function () {
        Route::get('', 'Monetization\CashbackController@all');
        Route::post('', 'Monetization\CashbackController@insert');
        Route::put('{id}/enable', 'Monetization\CashbackController@enable');
        Route::put('{id}/disable', 'Monetization\CashbackController@disable');
        Route::delete('{id}', 'Monetization\CashbackController@delete');
    });
});
