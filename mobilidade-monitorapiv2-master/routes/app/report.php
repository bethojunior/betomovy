<?php

use Illuminate\Support\Facades\Route;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/11/2019
 * Time: 14:52
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {
    /**
     * Rotas para indicacao de usuarios
     */
    Route::group(['prefix' => 'userIndication'], function () {
        Route::group(['prefix' => 'report'], function () {
            Route::get('referredUsers', 'User\UserIndicationReportController@countReferredUsers');
            Route::get('referralEarnings', 'User\UserIndicationReportController@commissions');
        });
    });

    Route::group(['prefix' => 'trip'], function () {
        Route::group(['prefix' => 'report'], function () {
            Route::get('valuesByDriver', 'Report\TripReportController@totalValuesByDriver');
        });
    });

    Route::group(['prefix' => 'report'], function () {
        Route::group(['prefix' => 'select2'], function () {
            Route::get('drivers', 'Report\Select\DriverSelectController@listSelect2');
            Route::get('customers/withUser', 'Report\Select\Select2Controller@listCustomersWithUser');
            Route::get('customers', 'Report\Select\Select2Controller@listCustomers');
            Route::get('company', 'Report\Select\Select2Controller@listByCompany');
            Route::get('central', 'Report\Select\Select2Controller@listByCentral');

        });

        Route::group(['prefix' => 'select'], function () {
            Route::get('tripPaymentForm', 'Report\Select\SelectController@listTripPaymentForm');
            Route::get('driverRegisterStatus', 'Report\Select\SelectController@listDriverRegisterStatus');
            Route::get('customerRegisterStatus', 'Report\Select\SelectController@listCustomerRegisterStatus');
            Route::get('partnerRegisterStatus', 'Report\Select\SelectController@listPartnerRegisterStatus');
            Route::get('tripCallType', 'Report\Select\SelectController@listTripCallType');
            Route::get('cities/actives', 'Report\Select\SelectController@listCitiesActives');
            Route::get('tripStatuses', 'Report\Select\SelectController@listTripStatuses');
            Route::get('deliveryOrderStatuses', 'Report\Select\SelectController@listDeliveryOrderStatuses');
            Route::get('tripTypes', 'Report\Select\SelectController@listTripTypes');
            Route::get('listByFlowType', 'Report\Select\SelectController@listByFlowType');
            Route::get('voucherMovements', 'Report\Select\SelectController@listTypesOfVoucherMovements');
            Route::get('userRegistrationLocations', 'Report\Select\SelectController@listUserRegistrationLocations');
            Route::get('deliveryPaymentForms', 'Report\Select\SelectController@listDeliveryPaymentForms');
            Route::get('central', 'Report\Select\SelectController@listAllCentral');
            Route::get('voucherMovementsCentral', 'Report\Select\SelectController@listTypesOfVoucherMovementsCentral');
            Route::get('listCallSourceType', 'Report\Select\SelectController@listCallSourceType');
        });

        /**
         * Lista os relatorios disponiveis
         */
        Route::get('', 'Report\ReportController@findAll');

        Route::get('financialDetailOfTrip', 'Report\Trip\FinancialDetailOfTripController');
        Route::get('financialTripDrivers', 'Report\DriverReportController@financialTripDrivers');
        Route::get('financialTripDriversLessFilter', 'Report\DriverReportController@financialTripDriversLessFilter');
        Route::get('all-drivers', 'Report\DriverReportController@findAll');
        Route::get('driverTripHistory/period', 'Report\DriverReportController@driverTripHistory');
        Route::get('historyDriverAllTripsValues', 'Report\DriverReportController@historyDriverAllTripsValues');
        Route::get('driverOnlineTime', 'Report\DriverReportController@driverOnlineTime');
        Route::get('tripHistory', 'Report\TripReportController@tripHistory');
        Route::get('trips', 'Report\TripReportController@listAll');
        Route::get('centralTrips', 'Report\TripReportController@listAllWithCentralFee');
        Route::get('corporateTravelList', 'Report\TripReportController@corporateTravelList');
        Route::get('financialStatementAdminVoucher', 'Report\TripReportController@financialStatementAdministrativeVoucher');
        Route::get('all-customers', 'Report\Customer\CustomerReportController@findAll');
        Route::get('voucherPurchase', 'Report\VoucherPurchaseReportController@findAll');
        Route::get('voucherMovements', 'Report\VoucherReportController@voucherMovements');
        Route::get('voucherMovementsByCentral', 'Report\VoucherReportController@voucherMovementsByCentral');
        Route::get('prepaidPurchase', 'Report\DriverReportController@prepaidPurchase');
        Route::get('access-log', 'Report\InternalAuditReportController@accessLog');

        Route::group(['prefix' => 'trip'], function () {
            Route::get('sharedRoutes', 'Report\TripReportController@getAllSharedRoutes');
            Route::get('callProduction', 'Report\TripReportController@callProduction');
        });

        Route::group(['prefix' => 'driver'], function () {
            Route::get('feeManagement', 'Report\DriverReportController@feeManagement');
            Route::get('balances', 'Report\DriverReportController@balanceDrivers');
            Route::get('blocked', 'Report\DriverReportController@blockedDrivers');
            Route::get('synthetic', 'Report\DriverReportController@synthetic');
            Route::get('blockedCustomers', 'Report\DriverReportController@customersBlockedByDrivers');
            Route::get('vehicleData', 'Report\DriverReportController@vehicleData');
            Route::get('excludedDrivers', 'Report\DriverReportController@excludedDrivers');
        });

        Route::group(['prefix' => 'customer'], function () {
            Route::get('manualVoucherInsertion', 'Report\Customer\CustomerReportController@manualVoucherInsertion');
            Route::get('blockedDrivers', 'Report\Customer\CustomerReportController@driverBlockedByCustomer');
        });

        Route::group(['prefix' => 'indication'], function () {
            Route::get('findByWhoIndicatedId', 'Report\IndicationReportController@findByWhoIndicatedId');
        });

        Route::group(['prefix' => 'discountCoupon'], function () {
            Route::get('findAllDiscountedTrip', 'Report\DiscountCouponReportController@findAllDiscountedTrip');
        });

        Route::group(['prefix' => 'establishmentCollectionManagement'], function () {
            Route::get('totalCharge', 'Report\EstablishmentCollectionManagementReportController@totalChargePerCompany');
        });

        Route::group(['prefix' => 'externalService'], function () {
            Route::get('findAllSms', 'Report\ExternalServiceReportController@findAllSms');
        });

        Route::group(['prefix' => 'delivery'], function () {
            Route::get('allOrders', 'Report\DeliveryReportController@allOrders');
            Route::get('deliveryFeeManagement', 'Report\DeliveryReportController@deliveryFeeManagement');
        });
    });

    Route::group(['prefix' => 'reportRecord'], function () {
        Route::get('', 'Report\ReportRecordController@findAll');
        Route::post('', 'Report\ReportRecordController@store');
    });
});
