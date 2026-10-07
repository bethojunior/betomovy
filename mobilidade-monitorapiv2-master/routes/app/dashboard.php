<?php

Route::group(['middleware' => 'auth:api'], function () {
    /**
     * Rotas de dashboard
     */
    Route::group(['prefix' => 'dashboard'], function () {
        Route::get('quantityTripsByStatus', 'Dashboard\DashboardController@quantityTripsByStatus');
        Route::get('quantityTripsCanceledByUser', 'Dashboard\DashboardController@quantityTripsCanceledByUser');
        Route::get('totalBillingByPaymentForm', 'Dashboard\DashboardController@totalBillingByPaymentForm');
        Route::get('averageTicketValue', 'Dashboard\DashboardController@averageTicketValue');
        Route::get('rankingDriver', 'Dashboard\DashboardController@rankingDriver');
        Route::get('rankingDriverAll', 'Dashboard\DashboardController@rankingDriverAll');
        Route::get('rankingCustomer', 'Dashboard\DashboardController@rankingCustomer');
        Route::get('rankingCustomerAll', 'Dashboard\DashboardController@rankingCustomerAll');
        Route::get('quantityDriversTotal', 'Dashboard\DashboardController@quantityDriversTotal');
        Route::get('quantityDriversActive', 'Dashboard\DashboardController@quantityDriversActive');
        Route::get('quantityCustomersTotal', 'Dashboard\DashboardController@quantityCustomersTotal');
        Route::get('quantityCustomersActive', 'Dashboard\DashboardController@quantityCustomersActive');
        Route::get('rankingCallType', 'Dashboard\DashboardController@rankingCallType');
        Route::get('rankingNeighborhood', 'Dashboard\DashboardController@rankingNeighborhood');
        Route::get('rankingHorary', 'Dashboard\DashboardController@rankingHorary');
        Route::get('lastDynamicsPlaces', 'Dashboard\DashboardController@lastDynamicsPlaces');
        Route::get('expensiveDynamicsPlaces', 'Dashboard\DashboardController@expensiveDynamicsPlaces');
        Route::get('placesMoreTripsDayAgo', 'Dashboard\DashboardController@placesMoreTripsDayAgo');
        Route::get('placesMoreTripsWeekAgo', 'Dashboard\DashboardController@placesMoreTripsWeekAgo');
        Route::get('tripQuantities', 'Dashboard\DashboardController@tripQuantities');
        Route::get('tripsByStatus', 'Dashboard\DashboardController@getTripsByStatus');
        Route::get('activeTrips', 'Dashboard\DashboardController@activeTrips');
        Route::get('activeTrips/{tripReference}', 'Dashboard\DashboardController@activeTripDetail');
        Route::get('abandonedTrips', 'Dashboard\DashboardController@abandonedTrips');
        Route::post('queueInsert/sync', 'Dashboard\DashboardController@syncQueueInsert');
        Route::get('currentQuantities', 'Dashboard\DashboardController@currentQuantities');
        Route::get('currentQuantitiesAll', 'Dashboard\DashboardController@currentQuantitiesAll');
        Route::get('statisticsByCity', 'Dashboard\DashboardController@statisticsByCity');
        Route::get('statisticsAll', 'Dashboard\DashboardController@statisticsAll');
        Route::get('userActivesByCity', 'Dashboard\DashboardController@driverAndCustomersActivesByCity');
        Route::get('activeCustomersLast10Minutes', 'Dashboard\DashboardController@getActiveCustomersLast10Minutes');
        Route::get('activeCustomersAllTime', 'Dashboard\DashboardController@getActiveCustomersAllTime');
        Route::get('all', 'Dashboard\DashboardController@all');
    });
});
