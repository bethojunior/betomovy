<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/09/2019
 * Time: 16:52
 */


/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {

    /**
     * Rotas para configurações de sugestões (placeholder)
     */
    Route::group(['prefix' => 'deliveryInfoSuggestion'], function () {
        Route::get('', 'Delivery\DeliveryInfoSuggestionController@all');
        Route::post('', 'Delivery\DeliveryInfoSuggestionController@insert');
    });

    /**
     * Listando tipos de item de delivery
     */
    Route::group(['prefix' => 'tripItemType'], function () {
        Route::post('', 'Delivery\TripItemTypeController@insert');
        Route::post('{id}', 'Delivery\TripItemTypeController@update');
        Route::delete('{id}', 'Delivery\TripItemTypeController@delete');
    });

    Route::group(['prefix' => 'companyDeliveryConfig'], function () {
        Route::post('', 'Delivery\CompanyDeliveryConfigController@insert');
        Route::get('company', 'Delivery\CompanyDeliveryConfigController@companies');
        Route::get('company/{companyId}', 'Delivery\CompanyDeliveryConfigController@findByCompany');
        Route::post('company/{companyId}', 'Delivery\CompanyDeliveryConfigController@update');
    });

    Route::group(['prefix' => 'deliveryNeighborhood'], function () {
        Route::post('', 'Delivery\DeliveryNeighborhoodController@store');
        Route::get('', 'Delivery\DeliveryNeighborhoodController@index');
        Route::delete('{deliveryNeighborhood}', 'Delivery\DeliveryNeighborhoodController@delete');
        Route::put('{deliveryNeighborhood}', 'Delivery\DeliveryNeighborhoodController@update');
    });

    Route::group(['prefix' => 'deliveryCharge'], function () {
        Route::get('', 'Delivery\DeliveryChargeController@find');
        Route::post('', 'Delivery\DeliveryChargeController@updateOrCreate');
    });

    Route::group(['prefix' => 'driverAttachmentType'], function () {
        Route::get('', 'User\DriverAttachmentTypeController@index');
        Route::post('', 'User\DriverAttachmentTypeController@store');
        Route::put('{driverAttachmentType}', 'User\DriverAttachmentTypeController@update');
        Route::post('{driverAttachmentType}/updatePicture', 'User\DriverAttachmentTypeController@updatePicture');
        Route::put('{driverAttachmentType}/enable', 'User\DriverAttachmentTypeController@enable');
        Route::put('{driverAttachmentType}/disable', 'User\DriverAttachmentTypeController@disable');
        Route::delete('{driverAttachmentType}', 'User\DriverAttachmentTypeController@delete');
    });

    Route::group(['prefix' => 'deliveryCallConfig'], function () {
        Route::get('', 'Delivery\DeliveryCallConfigController@findAll');
        Route::put('{deliveryCallConfig:key}', 'Delivery\DeliveryCallConfigController@update');
    });

    Route::group(['prefix' => 'typeDeliveryCategory'], function () {
        Route::get('', 'Delivery\TypeDeliveryCategoryController@list');
        Route::post('', 'Delivery\TypeDeliveryCategoryController@insert');
        Route::put('{typeDeliveryCategory}', 'Delivery\TypeDeliveryCategoryController@update');
        Route::delete('{typeDeliveryCategory}', 'Delivery\TypeDeliveryCategoryController@delete');
    });

    Route::group(['prefix' => 'deliveryRate'], function () {
        Route::post('', 'Delivery\DeliveryRateController@insert');
        Route::get('', 'Delivery\DeliveryRateController@getAll');
        Route::delete('{id}', 'Delivery\DeliveryRateController@delete');
    });

    Route::group(['prefix' => 'payMachineReturn'], function () {
        Route::post('', 'Delivery\PayMachineReturnController@store');
        Route::get('types', 'Delivery\PayMachineReturnTypeController@findAll');
        Route::get('{cityId}', 'Delivery\PayMachineReturnController@getActive');
    });

    Route::group(['prefix' => 'deliveryAcquirer'], function () {
        Route::put('token', 'Delivery\Acquirer\DeliveryAcquirerMetaDataController@updateToken');
        Route::get('token', 'Delivery\Acquirer\DeliveryAcquirerMetaDataController@getToken');
    });

    Route::group(['prefix' => 'deliveryOrder'], function () {
        Route::get('{cityId}/actives', 'Delivery\DeliveryOrderController@actives');
    });

    Route::group(['prefix' => 'deliverySection'], function () {
        Route::post('', 'Delivery\DeliverySectionController@store');
        Route::get('all', 'Delivery\DeliverySectionController@findAll');
        Route::post('{id}', 'Delivery\DeliverySectionController@update');
        Route::delete('{id}', 'Delivery\DeliverySectionController@delete');
    });


    Route::group(['prefix' => 'typeDeliveryCategoryBySection'], function () {
        Route::post('', 'Delivery\TypeDeliveryCategoryBySectionController@store');
        Route::get('{typeDeliveryCategoryId}', 'Delivery\TypeDeliveryCategoryBySectionController@findByTypeDeliveryCategory');
    });

    Route::group(['prefix' => 'deliveryConfig'], function () {
        Route::post('updateImageEstablishmentSignUp', 'Delivery\DeliveryConfigController@updateImageEstablishmentSignUp');
        Route::get('admin', 'Delivery\DeliveryConfigController@listConfigAdm');
    });

    Route::group(['prefix' => 'deliveryConfigAdmin'], function () {
        Route::get('', 'Delivery\DeliveryConfigAdminController@list');
        Route::post('', 'Delivery\DeliveryConfigAdminController@edit');
    });

});
