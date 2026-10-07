<?php
/**
 * Created by PhpStorm.
 * User: Luid Sousa
 * Date: 09/11/2020
 * Time: 16:53
 */

Route::group(['middleware' => 'auth:api'], function() {
    Route::group(['prefix' => 'routePromotionalBanner'], function (){
        Route::get('', 'Promotion\RoutePromotionalBannerController@findAll');
        Route::get('{id}', 'Promotion\RoutePromotionalBannerController@find');
        Route::post('', 'Promotion\RoutePromotionalBannerController@save');
        Route::delete('{id}', 'Promotion\RoutePromotionalBannerController@delete');
    });

    Route::group(['prefix' => 'voucherPromotion'], function (){
        Route::get('', 'Promotion\VoucherPromotionController@findAll');
        Route::get('{id}', 'Promotion\VoucherPromotionController@find');
        Route::post('', 'Promotion\VoucherPromotionController@save');
        Route::put('{id}', 'Promotion\VoucherPromotionController@update');
        Route::delete('{id}', 'Promotion\VoucherPromotionController@delete');
    });
});
