<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Essas rotas são utilizadas para as requisições feitas no react
|
*/

Route::post('authentication', 'Auth\LoginController@attemptLogin');

Route::post("forgotPassword/sendVerificationCodeEmail", "Auth\ForgotPasswordController@sendVerificationCodeEmail");

Route::group(['prefix' => 'configLayout', 'middleware' => 'throttle:5'], function () {
    Route::get('', 'Config\ConfigLayoutController@get');
});

Route::group(['middleware' => 'auth:api'], function () {
    Route::group(['prefix' => "product"], function () {
        Route::put('{deliveryProduct}/changeActive', 'Product\DeliveryProductController@changeActive');
        Route::put('positions', 'Product\DeliveryProductController@updatePosition');
    });

    Route::group(['prefix' => "category"], function () {
        Route::put('positions', 'Product\DeliveryCategoryController@updatePosition');
    });

    Route::group(['prefix' => "order"], function () {
        Route::get('all', 'Order\DeliveryOrderController@findAll');
    });

    Route::group(['prefix' => 'deliveryOrders'], function () {
        Route::get('{id}', 'Order\DeliveryOrderController@findOrderById');
        Route::get('', 'Order\DeliveryOrderController@findActives');

        Route::group(['prefix' => '{deliveryOrder}/chat'], function () {
            Route::get('', 'Order\DeliveryOrderMessageController@findAll');
            Route::post('sendMessage', 'Order\DeliveryOrderMessageController@sendMessage');
        });

        Route::group(['prefix' => '{deliveryOrder}/deliveryOrderActions'], function () {
            Route::post('confirm', 'Order\DeliveryOrderAction\CompanyOrderActionController@confirm');
            Route::delete('refuse', 'Order\DeliveryOrderAction\CompanyOrderActionController@refuse');
            Route::delete('cancel', 'Order\DeliveryOrderAction\CompanyOrderActionController@cancel');
            Route::post('prepare', 'Order\DeliveryOrderAction\CompanyOrderActionController@prepare');
            Route::post('withdrawInLocal', 'Order\DeliveryOrderAction\CompanyOrderActionController@withdrawInLocal');
            Route::post('searchDeliveryMan', 'Order\DeliveryOrderAction\CompanyOrderActionController@searchDeliveryMan');
            Route::post('outForDelivery/driver/{driverId}', 'Order\DeliveryOrderAction\CompanyOrderActionController@goOutForDelivery');
            Route::post('outForDeliveryManual', 'Order\DeliveryOrderAction\CompanyOrderActionController@goOutForDeliveryManual');
            Route::post('finish', 'Order\DeliveryOrderAction\CompanyOrderActionController@finish');
        });
    });

    Route::group(['prefix' => 'notification'], function () {
        Route::group(['prefix' => 'company'], function () {
            Route::post('registerToken', 'Notification\CompanyNotificationController@registerToken');
        });
    });


    Route::group(['prefix' => 'config'], function () {
        Route::get('mapKey', 'Config\ConfigController@findKeyMapbox');
    });

    Route::group(['prefix' => 'companyDeliveryArea'], function () {
        Route::post('', 'Company\CompanyDeliveryAreaController@store');
        Route::get('{companyId}', 'Company\CompanyDeliveryAreaController@findAll');
        Route::delete('{id}', 'Company\CompanyDeliveryAreaController@delete');
    });

    Route::group(['prefix' => '{companyId}/address'], function () {
        Route::get('', 'Company\CompanyAddressController@findActive');
        Route::post('', 'Company\CompanyAddressController@store');
    });

    Route::get('deliveryOrderStatuses', 'Order\DeliveryOrderStatusController@index');

    Route::group(['prefix' => 'company'], function () {
        Route::get("{companyId}/deliveryOrderConfig", "Company\CompanyDeliveryOrderConfigController@findByCompany");
        Route::get("{companyId}/rate", "Company\CompanyDeliveryRateController@findByCompany");
        Route::get("{companyId}/deliveryMan", "Company\CompanyDeliveryManController@findDeliveryManByCompany");
        Route::get("{companyId}/deliveryManActive", "Company\CompanyDeliveryManController@findDeliveryManActiveByCompany");
        Route::put("{companyId}/changeOpeningStatus", "Company\CompanyDeliveryOrderConfigController@changeOpeningStatus");
        Route::get("{companyId}/report/orders", "Company\CompanyReportController@orders");
    });

    Route::group(['prefix' => 'establishment'], function () {
        Route::get("{companyId}/billing", "Establishment\EstablishmentBillingController@findByCompany");
        Route::get("customer/create", "Establishment\EstablishmentBillingController@createCustomerInAsaas");
        Route::get("{establishmentBilling}/billet", "Establishment\EstablishmentBillingController@createBillet");
    });
});
