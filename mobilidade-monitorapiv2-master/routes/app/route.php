<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/11/2019
 * Time: 18:21
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {

    /**
     * Rotas para motoristas
     */
    Route::group(['prefix' => 'route'], function () {
        Route::post('', 'Route\RouteController@insert');
        Route::get('', 'Route\RouteController@all');
        Route::put('{id}/enable', 'Route\RouteController@enable');
        Route::put('{id}/disable', 'Route\RouteController@disable');
        Route::delete('{id}', 'Route\RouteController@delete');
        Route::put('{id}', 'Route\RouteController@update');
        Route::get('{id}', 'Route\RouteController@find');
    });

    Route::group(['prefix' => 'routeDriverAccepted'], function () {
        Route::get('', 'Route\RouteDriverAcceptedController@all');
        Route::put('{id}/enable', 'Route\RouteDriverAcceptedController@enable');
        Route::delete('{id}', 'Route\RouteDriverAcceptedController@delete');
    });

    Route::group(['prefix' => 'corporateRoute'], function () {
        Route::post('', 'Route\CorporateRouteController@insert');
        Route::get('', 'Route\CorporateRouteController@all');
        Route::get('{routeId}/companies', 'Route\CorporateRouteController@findCompaniesByRoute');
        Route::get('{companyId}/routes', 'Route\CorporateRouteController@findRouteByCompany');
        Route::delete('{id}', 'Route\CorporateRouteController@delete');
        Route::put('{id}', 'Route\CorporateRouteController@update');

        Route::post('user', 'Route\CorporateRouteCustomerController@insert');
        Route::get('{companyId}/users', 'Route\CorporateRouteCustomerController@listByCompany');
        Route::get('{companyId}/user', 'Route\CorporateRouteCustomerController@findCustomerByDocument');
        Route::delete('user/{id}', 'Route\CorporateRouteCustomerController@delete');
    });

    Route::group(['prefix' => 'scheduleCorporateRoute'], function () {
        Route::post('', 'Route\ScheduleCorporateRouteController@insert');
        Route::put('{id}', 'Route\ScheduleCorporateRouteController@update');
        Route::get('company/{companyId}', 'Route\ScheduleCorporateRouteController@findScheduleByCompany');
        Route::post('company/{companyId}/scheduled', 'Route\ScheduleCorporateRouteController@findScheduleCompanyByDate');
        Route::delete('{id}', 'Route\ScheduleCorporateRouteController@delete');

        Route::post('customer', 'Route\ScheduleCorporateRouteCustomerController@insert');
        Route::get('{scheduleCorporateRouteId}/customers', 'Route\ScheduleCorporateRouteCustomerController@listByScheduleCorporateRoute');
        Route::delete('customer/{id}', 'Route\ScheduleCorporateRouteCustomerController@delete');
    });


});
