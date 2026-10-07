<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/07/2020
 * Time: 16:08
 */

Route::group(['middleware' => 'auth:api'], function() {
    /**
     * Rotas de venda
     */
    Route::group(['prefix' => 'transfer'], function () {
        Route::post('', 'BalanceTransfer\BalanceTransferController@transfer');
        Route::get('{id}', 'BalanceTransfer\BalanceTransferController@find');
    });

    Route::get('financialStatement', 'BalanceTransfer\BalanceTransferController@financialStatement');

    /**
     * Rotas para formas de pagamento de transferencia
     */
    Route::get('paymentForm', 'BalanceTransfer\CashPaymentFormController@all');
});
