<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/09/2019
 * Time: 15:52
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {

    Route::get('blockReasonsType', 'Driver\BlockReasonsTypeController@index');
    Route::post('blockreasons/driver/{driver}', 'Driver\BlockReasonsController@insert');

    /**
     * Rotas para motoristas
     */
    Route::group(['prefix' => 'driver'], function () {
        Route::post('insertLimitHours', 'User\DriverController@insertLimitHours');
        Route::post('blockEnMasse/', 'Driver\BlockDriversEnMasseController@handle');
        Route::post('unblockEnMasse/', 'Driver\UnblockDriversEnMasseController@handle');

        Route::get('positions', 'User\DriverController@positions');
        Route::get('{driverId}/stations', 'User\DriverController@stations');
        Route::get('', 'User\DriverController@findAll');
        Route::get('delivery', 'User\DriverController@findAllDelivery');
        Route::post('/changeStatus/{driverId}', 'User\DriverController@changeStatus');
        Route::get('withoutPage', 'User\DriverController@findAllWithoutPage');
        Route::get('{driverId}/financial-report', 'User\DriverFinancialReportController@getDriverReport');

        Route::group(['prefix' => 'balance'], function () {
            Route::put('', 'Driver\DriverBalanceController@update');
        });
        Route::get('getAll', 'User\DriverController@getAll');
        Route::get('getBoletos', 'User\DriverController@getBoletos');

        Route::put('changeAllPrepaid', 'User\DriverController@changeDriversPrepaid');

        Route::group(['prefix' => '{driverId}/driverSplitConfig', 'namespace' => 'Driver'], function () {
            Route::get('', 'DriverSplitConfigController@findByDriver');
            Route::post('', 'DriverSplitConfigController@store');
        });
        Route::group(['prefix' => '{driverId}/address', 'namespace' => 'Driver'], function () {
            Route::post('', 'DriverAddressController@store');
        });
        Route::get('{driverId}/financial', 'Driver\DriverBalanceFlowController@findByDriver');

        Route::put('resetRating/{id?}', 'User\DriverController@resetRating');

        Route::put('{driver}/activateRegister', 'User\DriverController@activateRegister');
        Route::put('{driverId}/bank-account', 'Driver\DriverBankAccountController@update');
        Route::put('{driver}', 'User\DriverController@edit');
        Route::get('{driverId}', 'User\DriverController@show');
        Route::post('{driverId}/validate-registration', 'User\DriverController@validateRegistration');
        Route::delete('{driverId}', 'User\DriverController@delete');
        Route::get('list/select2', 'User\DriverController@listSelect2');

        Route::post('criminal-record/{id}', 'User\DriverController@criminalRecord');

        Route::post('{driverId}/profileImage/requestNew', 'Driver\ProfileImageStatusController@requestNewPicture');
        Route::post('{driverId}/profileImage/authorize', 'Driver\UpdateProfileImageController@authorizeImage');
        Route::post('{driverId}/profileImage/deny', 'Driver\UpdateProfileImageController@deny');
        Route::post('{driverId}/profileImage', 'Driver\ProfilePhotoController@upload');

        Route::get('{driver}/driverFormOfPayment',
            'Driver\DriverFormOfPaymentController@findByDriver');

        Route::group(['prefix' => '{driver}/driverFormOfPaymentBlocked'], function () {
            Route::get('',
                'Driver\DriverFormOfPaymentController@findBlockedByDriver');
            Route::put('',
                'Driver\DriverFormOfPaymentController@blockFormOfPayment');
        });

        Route::group(['prefix' => '{driver}/driverFormOfPaymentImposition'], function () {
            Route::get('',
                'Driver\DriverFormOfPaymentController@findByDriverImposition');
            Route::put('',
                'Driver\DriverFormOfPaymentController@impositionFormOfPayment');
        });

        Route::group(['prefix' => '{driver}/accountBank/'], function () {
            Route::get('', 'Driver\DriverAccountBankController@index');
            Route::put('', 'Driver\DriverAccountBankController@store');
        });

        Route::group(['prefix' => 'documents', 'namespace' => 'User'], function () {
            Route::put('requestDocuments', 'DriverController@requestDocumentAndPhoto');
        });

        Route::get('{driverId}/lastPositions', 'User\DriverController@lastPositions');

    });

    Route::group(['prefix' => 'car'], function () {
        Route::get('getPendingCars/{cityId?}', 'Driver\CarController@getPendingCars');
        Route::post('acceptCar', 'Driver\CarController@acceptCar');
        Route::post('rejectCar', 'Driver\CarController@rejectCar');
        Route::put('{id}', 'Driver\CarController@edit');
    });

    Route::group(['prefix' => 'iconMapDriver'], function () {
        Route::get('', 'Driver\IconMapDriverController@findAll');
        Route::get('{id}', 'Driver\IconMapDriverController@find');
        Route::post('', 'Driver\IconMapDriverController@store');
        Route::post('{iconMapDriver}', 'Driver\IconMapDriverController@update');
        Route::delete('{iconMapDriver}', 'Driver\IconMapDriverController@delete');
    });

    Route::post('resetBalance/driver', 'User\DriverController@resetAllBalance');
    Route::post('resetBalance/driver/{driver}', 'User\DriverController@resetBalance');
    Route::get('driver/{driver}/driverAppInfo', 'User\DriverAppInfoController@findByDriver');
});
