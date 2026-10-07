<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/09/2019
 * Time: 11:35
 */

Route::group(['middleware' => 'auth:api'], function () {
    /**
     * Rotas de viagens (geral)
     */
    Route::group(['prefix' => 'trip'], function () {
        Route::get('', 'Trip\TripController@findAll');
        Route::get('analysis', 'Trip\TripController@findInAnalysis');
        Route::put('release/{tripReference?}', 'Trip\TripController@release');

        Route::group(['prefix' => 'cancellationFee'], function () {
            Route::get('', 'Trip\TripCancellationFeeController@all');
            Route::get('findAll', 'Trip\TripCancellationFeeController@findAll');
            Route::delete('{id}', 'Trip\TripCancellationFeeController@delete');
        });

        Route::group(['prefix' => 'financialMirror'], function () {
            Route::get('', 'Trip\TripController@getFinancialMirror');
        });

        Route::get('{tripReference}/driverPositions', 'Trip\TripController@driverPositions');
        Route::get('{tripReference}/way', 'Trip\TripController@findWay');
        Route::get('{tripReference}', 'Trip\TripController@find');
        Route::put('{tripReference}/cancel', 'Trip\TripController@cancel');
        Route::put('{tripReference}/finish', 'Trip\TripController@finish');
        Route::get('{tripReference}/rideTrip', 'Trip\TripController@findRideTrip');

    });

    Route::get('scheduled/trip', 'Trip\TripController@findAllScheduled');
    Route::get('chat/{tripReference}', 'Trip\ChatTrip\MessagesChatTripController@findByTrip');

    Route::group(['prefix' => 'tripType'], function () {
        Route::post('', 'Trip\TripTypeController@insert');
        Route::post('{tripType}/update', 'Trip\TripTypeController@update');
        Route::get('', 'Trip\TripTypeController@all');
        Route::delete('{id}', 'Trip\TripTypeController@delete');
    });

    Route::group(['prefix' => 'tripTypeDriver'], function () {
        Route::get('', 'Trip\TripTypeDriverController@findAll');
        Route::post('', 'Trip\TripTypeDriverController@insert');
        Route::delete('', 'Trip\TripTypeDriverController@delete');
    });

    Route::group(['prefix' => 'tripReport'], function () {
        Route::get('', 'Trip\TripReportController@findAll');
    });

    Route::group(['prefix' => 'tripRating'], function () {
        Route::get('', 'Trip\TripRatingController@findAll');
    });

    Route::group(['prefix' => 'chatBotTrip'], function () {
        Route::get('', 'ChatBot\ChatBotTripController@all');
        Route::post('', 'ChatBot\ChatBotTripController@insert');
        Route::put('{idChatBotTrip}', 'ChatBot\ChatBotTripController@edit');
        Route::delete('{idChatBotTrip}', 'ChatBot\ChatBotTripController@delete');
    });

    Route::group(['prefix' => 'chatBotTripType'], function () {
        Route::get('', 'ChatBot\ChatBotTripTypeController@all');
    });

    Route::group(['prefix' => 'partnerCommission'], function () {
        Route::post('', 'Trip\Commission\PartnerCommissionController@insert');
        Route::get('', 'Trip\Commission\PartnerCommissionController@index');
        Route::put('{partnerCommission}', 'Trip\Commission\PartnerCommissionController@update');
        Route::delete('{partnerCommission}', 'Trip\Commission\PartnerCommissionController@delete');
    });

    Route::group(['prefix' => 'cancellationReasons'], function () {
        Route::get('', 'CancellationReasons\CancellationReasonsController@index');
        Route::post('insert', 'CancellationReasons\CancellationReasonsController@insert');
        Route::put('{idCancellationReasons}', 'CancellationReasons\CancellationReasonsController@update');
        Route::delete('{idCancellationReasons}', 'CancellationReasons\CancellationReasonsController@delete');
    });

    Route::group(['prefix' => 'toll'], function () {
        Route::post('', 'Trip\TollController@insert');
        Route::get('', 'Trip\TollController@all');
        Route::get('/{cityId}', 'Trip\TollController@byCity');
        Route::put('{toll}', 'Trip\TollController@update');
        Route::delete('{toll}', 'Trip\TollController@delete');
    });

    Route::group(['prefix' => 'tax'], function () {
        Route::get('', 'Trip\TaxController@findAll');
        Route::post('', 'Trip\TaxController@store');
        Route::put('{id}', 'Trip\TaxController@update');
        Route::put('{id}/active', 'Trip\TaxController@active');
        Route::delete('{id}', 'Trip\TaxController@delete');
    });
});
