<?php

Route::group(['middleware' => 'auth:api'], function() {
    Route::group(['prefix' => 'coupon'], function () {
        Route::post('add', 'Promotion\UserDiscountCouponDeliveryController@insert');
        Route::get('{userId}', 'Promotion\UserDiscountCouponDeliveryController@findAll');
        Route::get('{userId}/company/{companyId}', 'Promotion\UserDiscountCouponDeliveryController@findAllCompany');
    });
});
