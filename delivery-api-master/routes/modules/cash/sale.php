<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/07/2020
 * Time: 09:21
 */

Route::group(['middleware' => 'auth:api'], function() {
    /**
     * Rotas de venda
     */
    Route::group(['prefix' => 'sale'], function () {
        Route::get('', 'Sale\SaleController@all');
        Route::post('companyPay', "Sale\SaleController@payACompany");
        Route::post('{secondaryId}/pay', "Sale\SaleController@pay");
        Route::get('{secondaryId}', 'Sale\SaleController@find');
    });

    /**
     * Formas de pagamento da venda
     */
    Route::get('salePaymentForm', 'Sale\SalePaymentFormController@all');

    /**
     * Status de venda
     */
    Route::get('saleStatus', 'Sale\SaleStatusController@all');
});
