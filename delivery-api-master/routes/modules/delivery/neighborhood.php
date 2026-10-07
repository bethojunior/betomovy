<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 18:54
 */

Route::group(['middleware' => 'auth:api'], function() {
    /**
     * Rotas para bairros / Zonas de entregas
     */
    Route::group(['prefix' => 'neighborhood'], function () {
        Route::get('{deliveryNeighborhood}/company/{company}',
            'Neighborhood\DeliveryNeighborhoodController@consultDeliveryPrice');
        Route::get('', 'Neighborhood\DeliveryNeighborhoodController@findByCoordinate');
    });

    Route::group(['prefix' => 'typeDeliveryCategory'], function(){
        Route::get('', 'Delivery\TypeDeliveryCategoryController@findAll');
    });

});
