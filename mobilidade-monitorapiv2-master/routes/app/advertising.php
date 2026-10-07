<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/10/2019
 * Time: 17:16
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {

    /**
     * Rotas para locais da publicidade no app
     */
    Route::get('advertisingAppSite', 'Advertising\AdvertisingAppSiteController@all');

    /**
     * Rotas para Publicidade
     */
    Route::group(['prefix' => 'advertising'], function () {
        Route::post('', 'Advertising\AdvertisingController@insert');
        Route::get('', 'Advertising\AdvertisingController@findAll');
        Route::put('update-order', 'Advertising\AdvertisingController@updateOrder');
        Route::post('{id}/update', 'Advertising\AdvertisingController@update');
        Route::get('{id}/show', 'Advertising\AdvertisingController@show');
        Route::put('{id}/enable', 'Advertising\AdvertisingController@enable');
        Route::put('{id}/disable', 'Advertising\AdvertisingController@disable');
        Route::delete('{id}', 'Advertising\AdvertisingController@delete');
    });

    /**
     * Rotas para Cupom de desconto
     */
    Route::group(['prefix' => 'discountCoupon'], function () {
        Route::get('', 'DiscountCoupon\DiscountCouponController@findAll');
        Route::post('', 'DiscountCoupon\DiscountCouponController@insert');
        Route::put('{id}/enable', 'DiscountCoupon\DiscountCouponController@enable');
        Route::put('{id}/disable', 'DiscountCoupon\DiscountCouponController@disable');
        Route::delete('{id}', 'DiscountCoupon\DiscountCouponController@delete');
    });
});
