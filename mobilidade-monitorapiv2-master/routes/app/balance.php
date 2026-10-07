<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/09/2019
 * Time: 14:08
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {

    /**
     * Rotas para motoristas
     */
    Route::group(['prefix' => 'balanceFlowType'], function () {
        Route::get('searchable', 'Balance\BalanceFlowTypeController@findSearchable');
    });

    /**
     * Rotas para lançamentos financeiros
     */
    Route::group(['prefix' => 'balancePosting'], function () {
        Route::get('', 'Balance\BalancePostingController@index');
        Route::post('', 'Balance\BalancePostingController@insert');
        Route::delete('{balancePosting}', 'Balance\BalancePostingController@delete');
    });

    /**
     * Rotas para créditos pré-pagos
     */
    Route::group(['prefix' => 'creditPrepaid'], function () {
        Route::post('', 'Balance\CreditPrepaidController@insert');
        Route::get('', 'Balance\CreditPrepaidController@index');
        Route::put('{creditPrepaid}', 'Balance\CreditPrepaidController@update');
        Route::delete('{creditPrepaid}', 'Balance\CreditPrepaidController@delete');
    });
    Route::group(['prefix' => 'creditPrepaidPurchase'], function () {
        Route::get('', 'Balance\CreditPrepaidPurchaseController@findAll');
        Route::get('/{cityId}', 'Balance\CreditPrepaidPurchaseController@findByCityId');
        Route::put('{creditPrepaidPurchase}/credit', 'Balance\CreditPrepaidPurchaseController@credit');
        Route::put('{creditPrepaidPurchase}/refuse', 'Balance\CreditPrepaidPurchaseController@refuse');
    });

    /**
     * Rotas para transferências (motoristas e clientes)
     */
    Route::group(['prefix' => 'withdraw', 'namespace' => 'Balance'], function () {
        Route::put('multiples', 'WithdrawController@confirmMultiples');
        Route::get('', 'WithdrawController@index');
        Route::get('account-balance', 'WithdrawController@accountBalance');
        Route::get('{withdraw}', 'WithdrawController@show');
        Route::put('{withdraw}/reject', 'WithdrawController@reject');
        Route::put('{withdraw}', 'WithdrawController@confirm');
    });

    /**
     * Rotas para voucher
     */
    Route::group(['prefix' => 'balance'], function () {
        Route::put('{id}/flow', 'Balance\BalanceController@manageBalance');
        Route::put('driver/{id}', 'Balance\BalanceController@insertBalanceDriver');
    });
});
