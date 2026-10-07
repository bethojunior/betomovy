<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'Auth\HomeController@index')->name('welcome');

Auth::routes();

Route::group(['prefix' => 'company', 'as' => 'company.'], function () {
    Route::get('register', 'User\UserController@preregister')->name('preregister');
    Route::post('pregister', 'Company\CompanyRegisterController@preRegister')->name('store.preregister');
});

Route::group(['middleware' => 'auth'], function () {
    Route::get('/home', 'Auth\HomeController@home')->name('home');

    Route::group(['prefix' => 'config'], function () {
        Route::group(['as' => 'config'], function () {
            Route::get('products', 'Config\ConfigController@createProducts')->name('.products');
            Route::get('category', 'Config\ConfigController@createCategory')->name('.category');
            Route::post('category', 'Config\ConfigController@updateCategory')->name('.update');
            Route::get('class', 'Config\ConfigController@createClass')->name('.class');
            Route::get('optional', 'Config\ConfigController@createOptional')->name('.optional');
            Route::get('zone', 'Config\ConfigController@createZone')->name('.zone');
            Route::get('profile', 'Config\ConfigController@profile')->name('.profile');
            Route::get('financial', 'Config\ConfigController@financial')->name('.financial');
            Route::get('report', 'Config\ConfigController@report')->name('.report');
            Route::get('advanced', 'Config\ConfigController@advanced')->name('.advanced');
            Route::get('deliveryman', 'Config\ConfigController@deliveryman')->name('.deliveryman');
            Route::get('address', 'Config\ConfigController@address')->name('.address');
            Route::get('rate', 'Config\ConfigController@rate')->name('.rate');
            Route::get('deliveryArea', 'Config\ConfigController@deliveryArea')->name('.deliveryArea');
            Route::get('download-printer','Config\ConfigController@downloadPrinter')->name('.download-printer');
        });
    });

    Route::group(['prefix' => 'company', 'as' => 'company.'], function () {
        Route::post('update', 'Company\CompanyController@update')->name('update');
    });

    Route::group(['prefix' => 'categories', 'as' => 'categories.'], function () {
        Route::post('', 'Product\DeliveryCategoryController@store')->name('store');
        Route::put('', 'Product\DeliveryCategoryController@update')->name('update');
        Route::delete('{deliveryCategory}', 'Product\DeliveryCategoryController@destroy')->name('destroy');
    });

    Route::group(['prefix' => 'products', 'as' => 'products.'], function () {
        Route::post('', 'Product\DeliveryProductController@store')->name('store');
        Route::delete('{deliveryProduct}', 'Product\DeliveryProductController@delete')->name('delete');
        Route::get('{id}', 'Product\DeliveryProductController@show')->name('show');
        Route::post('{deliveryProduct}', 'Product\DeliveryProductController@update')->name('update');
    });

    Route::group(['prefix' => 'openHour', 'as' => 'openHour.'], function () {
        Route::post('', 'Company\CompanyOpenHourController@save')->name('save');
    });

    Route::group(['prefix' => 'rate', 'as' => 'rate.'], function () {
        Route::post('', 'Company\CompanyDeliveryRateController@store')->name('store');
        Route::delete('{companyDeliveryRate}', 'Company\CompanyDeliveryRateController@delete')->name('delete');
    });


    Route::group(['prefix' => 'zones', 'as' => 'zones.'], function () {
        Route::post('', 'Neighborhood\CompanyDeliveryNeighborhoodController@store')->name('store');
        Route::delete('{companyDeliveryNeighborhood}', 'Neighborhood\CompanyDeliveryNeighborhoodController@delete')->name('delete');
        Route::post('{companyDeliveryNeighborhood}/activate', 'Neighborhood\CompanyDeliveryNeighborhoodController@activate')->name('activate');
        Route::post('{companyDeliveryNeighborhood}/disable', 'Neighborhood\CompanyDeliveryNeighborhoodController@disable')->name('disable');
    });

    Route::group(['prefix' => 'sales'], function () {
        Route::group(['as' => 'sales'], function () {
            Route::get('list', 'Sales\SalesController@lastSales')->name('.lastSales');
        });
    });

    Route::group(['prefix' => 'marketing'], function () {
        Route::group(['as' => 'marketing'], function () {
            Route::get('notification', 'Marketing\MarketingController@notification')->name('.notification');
            Route::get('coupon', 'Marketing\MarketingController@coupon')->name('.coupon');
        });
    });

    Route::group(['prefix' => 'user'], function () {
        Route::group(['as' => 'user'], function () {
            Route::get('list', 'User\UserController@list')->name('.list');
            Route::get('settings', 'User\UserController@fieldRegister')->name('.settings');
        });
    });

    Route::group(['prefix' => 'user'], function () {
        Route::group(['as' => 'user'], function () {
            Route::get('list', 'User\UserController@list')->name('.list');
            Route::get('settings', 'User\UserController@fieldRegister')->name('.settings');
        });

        Route::group(['prefix' => 'paymentForm', 'as' => 'paymentform.'], function () {
            Route::get('', 'Company\CompanyPaymentFormController@index')->name('index');
            Route::post('', 'Company\CompanyPaymentFormController@store')->name('store');
            Route::delete('{companyPaymentForm}', 'Company\CompanyPaymentFormController@delete')->name('delete');
        });
    });

    Route::group(['prefix' => 'driver', 'as' => 'driver.'], function () {
        Route::get('', 'Driver\DriverController@index')
            ->name('index')
            ->middleware('own_delivery_men');
    });

    Route::group(['prefix' => 'delivery', 'as' => 'delivery.'], function () {
        Route::get("order", "Delivery\OrderController@index");
        Route::get("orderPrinter", "Delivery\OrderController@orderPrinter");
    });

    Route::group(['prefix' => 'companyDeliveryOrderConfig', 'as' => 'companyDeliveryOrderConfig.'], function () {
        Route::post('updateAverageDeliveryTime', 'Company\CompanyDeliveryOrderConfigController@updateAverageDeliveryTime')->name('updateAverageDeliveryTime');
        Route::post('updateMinPrice', 'Company\CompanyDeliveryOrderConfigController@updateMinPrice')->name('updateMinPrice');
        Route::post('updateCalledMode', 'Company\CompanyDeliveryOrderConfigController@updateCalledMode')->name('updateCalledMode');
    });


    Route::group(['prefix' => 'companyDeliveryMan', 'as' => 'companyDeliveryMan.'], function () {
        Route::post('store', 'Company\CompanyDeliveryManController@store')->name('store');
        Route::delete('delete/{id}', 'Company\CompanyDeliveryManController@delete')->name('delete');
    });

    Route::group(['prefix' => 'promotion', 'as' => 'promotion.'], function () {
        Route::get('coupons', 'Promotion\CouponController@index')->name('coupons');
        Route::post('', 'Promotion\CouponController@store')->name('coupon');
        Route::delete('{id}', 'Promotion\CouponController@delete')->name('deleteCoupon');
    });

    Route::group(['prefix' => 'report', 'as' => 'report.'], function () {
        Route::get('orders', 'Report\ReportController@orders')->name('orders');
    });

    Route::group(['prefix' => 'pix', 'as' => 'pix.'], function () {
        Route::post('update', 'Config\SettingDeliveryCompanyPixController@update')->name('update');
    });

    Route::group(['prefix' => 'financial', 'as' => 'financial.'], function () {
        Route::get('billing', 'Financial\FinancialController@billing')->name('billing');
    });
});
