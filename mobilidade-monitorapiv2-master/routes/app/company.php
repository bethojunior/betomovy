<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/10/2019
 * Time: 10:27
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {

    /**
     * Rotas para PJ
     */
    Route::group(['prefix' => 'company'], function () {
        Route::get('', 'Company\CompanyController@findAll');
        Route::post('', 'Company\CompanyController@insert');
        Route::put('', 'Company\CompanyController@edit');
        Route::get('{id}', 'Company\CompanyController@get');
        Route::delete('{id}', 'Company\CompanyController@delete');
        Route::get('{id}/workers', 'Company\CompanyController@workers');
        Route::put('{id}/enable', 'Company\CompanyController@enable');
        Route::put('{id}/block', 'Company\CompanyController@block');
        Route::put('{id}/setEstablishmentCollectionManagement', 'Company\CompanyController@setEstablishmentCollectionManagement');

        /**
         * Rotas de voucher para PJ
         */
        Route::post('{companyId}/voucher/{action}', 'Company\CompanyVoucherController@changeBalance');
    });

    /**
     * Rotas para tipos de serviços empresariais
     */
    Route::get('companyServiceType', 'Company\CompanyServiceTypeController@index');

    Route::group(['prefix' => 'companyWorker'], function () {
        Route::post('', 'Company\CompanyWorkerController@add');
        Route::delete('{id}', 'Company\CompanyWorkerController@delete');
    });

    /**
     * Rotas para endereços da empresa
     */
    Route::group(['prefix' => 'companyAddress'], function () {
        Route::post('', 'Company\CompanyAddressController@store');
        Route::get('', 'Company\CompanyAddressController@index');
        Route::delete('{companyAddress}', 'Company\CompanyAddressController@delete');
        Route::put('{companyAddress}', 'Company\CompanyAddressController@markDefault');
    });
});
