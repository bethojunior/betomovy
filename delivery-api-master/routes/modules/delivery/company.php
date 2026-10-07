<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/05/2020
 * Time: 18:06
 */

/**
 * Rotas para listagem de empresas delivery
 */
Route::group(['prefix' => 'company'], function () {
    Route::get('near', 'Company\CompanyController@findNear');
    Route::get('random', 'Company\CompanyController@findRandom');
    Route::get('{companyId}/products', 'Product\DeliveryProductController@findByCategory');
    Route::post('{companyId}/companyDeliveryArea', 'Company\CompanyDeliveryRateController@calculate');
    Route::post('pix', 'Config\SettingDeliveryCompanyPixController@generateQRCodePix');
});
