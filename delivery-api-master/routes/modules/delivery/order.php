<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/06/2020
 * Time: 11:45
 */

Route::group(['middleware' => 'auth:api'], function () {
    /**
     * Rotas para pedidos
     */
    Route::group(['prefix' => 'order'], function () {
        /**
         * cliente
         */
        Route::post('', 'Order\DeliveryOrderController@make');
        Route::get('customer', 'Order\DeliveryOrderListController@listByCustomer');
        Route::delete('{deliveryOrder}/cancelByCustomer', 'Order\CancelDeliveryOrderController@cancelByCustomer');
            Route::delete('{deliveryOrder}/cancelByDriver', 'Order\CancelDeliveryOrderController@cancelByDriver');
        Route::get('actives/customer', 'Order\DeliveryOrderController@findByCustomer');

        /**
         * entregador
         */
        Route::get('driver', 'Order\DeliveryOrderListController@listByDriver');
        Route::get('actives/driver', 'Order\DeliveryOrderController@findByDriver');

        Route::group(['prefix' => '{deliveryOrder}', 'as' => 'step.'], function () {
            Route::post('accept', 'Order\DeliveryOrderController@accept')->name('accept');
            Route::delete('refuse', 'Order\DeliveryOrderController@refuse')->name('refuse');
            Route::post('informArrival', 'Order\DeliveryOrderController@informArrival')
                ->name('informArrival');
            Route::post('goOutForDelivery', 'Order\DeliveryOrderController@goOutForDelivery')
                ->name('goOutForDelivery');
            Route::post('arriveOnDelivery', 'Order\DeliveryOrderController@arriveOnDelivery')
                ->name('arriveOnDelivery');
            Route::post('deliver', 'Order\DeliveryOrderController@deliver')
                ->name('deliver');
            Route::post('return', 'Order\DeliveryOrderController@return')
                ->name('return');
            Route::post('finish', 'Order\DeliveryOrderController@finish')
                ->name('finish');

            Route::get('chat', 'Order\DeliveryOrderMessageController@findAll');
            Route::post('chat', 'Order\DeliveryOrderMessageController@send');
        });


        /**
         * comum
         */
        Route::get('{id}', 'Order\DeliveryOrderController@show');

        Route::post('evaluate', 'Order\DeliveryRatingController@evaluate');
    });

    Route::group(['prefix' => 'orderStatus'], function () {
        Route::get('', 'Order\DeliveryOrderStatusController@findShowableInApp');
    });

    Route::group(['prefix' => 'occurrence'], function () {
        Route::post('', 'Order\DeliveryOccurrenceController@store');
    });
});
