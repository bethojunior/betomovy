<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
|---------------------------------------------------------------------------
| Public Routes
|---------------------------------------------------------------------------
*/

Route::get('/healthy', function () {
    $status = [
        'app' => true,
        'mysql' => false,
        'mongo' => false,
        'timestamp' => now()->toDateTimeString(),
    ];

    try {
        DB::connection()->getPdo();
        $status['mysql'] = true;
    } catch (\Throwable $e) {
        $status['mysql_error'] = $e->getMessage();
    }

    try {
        Cache::put('health_check_test', true, 5);
        $status['mongo'] = Cache::get('health_check_test') === true;
    } catch (\Throwable $e) {
        $status['mongo_error'] = $e->getMessage();
    }

    return response()->json([
        'status' => $status['app'] && $status['mysql'] ? 'UP' : 'DOWN',
        'services' => $status,
    ], $status['mysql'] ? 200 : 500);
});

Route::post('login', 'User\AuthenticationController@authentication');
Route::post('central', 'Central\CentralController@register');
Route::post('user/forgetPassword', 'User\UserController@forgetPassword');
Route::put('user/{id}/password', 'User\UserController@setPassword');
Route::post('user/register', 'User\UserController@registerBySite');

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {

    Route::get('user/{id}', 'User\UserController@findWithCustomer');

    /**
     * Rotas de viagem
     */
    Route::group(['prefix' => 'trip'], function () {
        Route::post('', 'Trip\TripController@insert');
        Route::post('scheduled/batch', 'Trip\TripController@insertScheduledBatch');
        Route::get('{tripReference}/driverPositions', 'Trip\TripController@driverPosition');
        Route::get('fee', 'Trip\TripController@findFee');
        Route::get('{tripReference}', 'Trip\TripController@find');
        Route::put('{tripReference}/cancel', 'Trip\TripController@cancel');
        Route::put('{tripReference}/schedule', 'Trip\TripController@updateScheduled');
    });

    /**
     * Rotas chat da viagem
     */
    Route::group(['prefix' => 'chatTrip'], function () {
        Route::post('{tripReference}/message', 'Trip\ChatTrip\ChatTripController@sendMessage');
    });

    /**
     * Rotas de motorista
     */
    Route::group(['prefix' => 'driver'], function () {
        Route::get('{id}/position', 'User\DriverController@position');
        Route::post('blockDriver', 'User\DriverController@blockDriver');
        Route::put('unblockDriver/{id}', 'User\DriverController@unblockDriver');
    });

    Route::group(['prefix' => 'central'], function () {
        /**
         * Rotas da Central
         */
        Route::get('monitoring/{centralId}', 'Monitoring\MonitoringController@handle');
        Route::get('{id}', 'Central\CentralController@find');

        /**
         * Rotas de motoristas da central
         */
        Route::post('driver', 'Central\CentralDriverController@insert');
        Route::put('favorite/driver', 'Central\CentralController@updateFavorite');
        Route::group(['prefix' => '{central_id}/driver'], function () {
            Route::get('', 'Central\CentralController@getDrivers');
            Route::get('active', 'Central\CentralController@getDriversActive');
            Route::delete('{driverId}', 'Central\CentralDriverController@delete');
            Route::get('positions', 'Central\CentralDriverController@positions');
        });

        Route::get('{central}/customer', 'Central\CentralController@getCustomers');
        Route::group(['prefix' => '{central_id}/customer'], function () {
            Route::post('', 'Central\CentralCustomerController@store');
            Route::put('{id}', 'Central\CentralCustomerController@update');
            Route::get('{id}', 'Central\CentralCustomerController@find');
            Route::delete('{id}', 'Central\CentralCustomerController@delete');
            Route::put('{id}/{action}', 'Central\CentralCustomerController@blockOrRelease');
        });

        /**
         * Rotas de tarifas da central
         */
        Route::group(['prefix' => 'price'], function () {
            Route::post('', 'Central\PriceController@store');
            Route::put('{price_id}', 'Central\PriceController@update');
            Route::delete('{price_id}', 'Central\PriceController@delete');
        });
        Route::group(['prefix' => '{central_id}/price'], function () {
            Route::get('', 'Central\PriceController@findAllCentralPrices');
            Route::get('calculate', 'Central\PriceController@calculate');
            Route::get('neighborhood/calculate', 'Central\PriceController@calculateByNeighborhood');
        });

        /**
         * Rotas de raio de chamamento
         */
        Route::group(['prefix' => '{centralId}/zone'], function () {
            Route::post('', 'Central\ZoneController@store');
            Route::get('', 'Central\ZoneController@findZoneByCentral');
            Route::put('{zone_id}', 'Central\ZoneController@update');
        });

        /**
         * Rotas de viagens da central
         */
        Route::group(['prefix' => '{centralId}/trip'], function () {
            Route::get('', 'Trip\TripController@findByCentral');
            Route::get('actives', 'Trip\TripController@activeSummaries');
            Route::get('activesRealtime', 'Trip\TripController@actives');
        });

        /**
         * Rotas de perguntas para informações das viagens
         */
        Route::group(['prefix' => '{centralId}/tripInfoQuestion'], function () {
            Route::get('', 'Central\CentralTripInfoQuestionController@findAll');
            Route::get('{questionId}', 'Central\CentralTripInfoQuestionController@find');
            Route::post('', 'Central\CentralTripInfoQuestionController@store');
            Route::put('{questionId}', 'Central\CentralTripInfoQuestionController@update');
            Route::delete('{questionId}', 'Central\CentralTripInfoQuestionController@delete');
        });

        /**
         * Rotas de formas de pagamento de Compra de Voucher
         */
        Route::group(['prefix' => 'voucherPurchasePayment'], function () {
            Route::get('findAllActives', 'Central\CentralVoucherPurchasePaymentController@findAllActives');
        });

        /**
         * Rotas de Tipos de Chamados
         */
        Route::group(['prefix' => 'centralCallTypes'], function () {
            Route::get('findAll', 'Central\CentralController@findAllCentralCallTypes');
        });
        Route::get('discount/{centralId}', 'Central\CentralController@getDiscountConfigs');
    });

    /**
     * Rotas de config
     */
    Route::group(['prefix' => 'config'], function () {
        Route::get('location', 'Config\CityConfigController@getConfig');
        Route::get('{key}', 'Config\ConfigController@findByKey');
    });

    /**
     * Rotas de places (cache)
     */
    Route::get('place/search', 'Place\PlaceController@search');

    /**
     * Rotas de enums
     */
    Route::get('tripPaymentForm', 'Trip\TripPaymentFormController@all');
    Route::get('tripType', 'Trip\TripTypeController@all');
    Route::get('city', 'Locale\CityController@all');
    Route::get('estate', 'Locale\EstateController@all');

    Route::get('neighborhood', 'Central\NeighborhoodController@findByCityArea');

    Route::group(['prefix' => 'centralNeighborhood'], function () {
        Route::post('', 'Central\CentralNeighborhoodController@store');
        Route::get('{central}', 'Central\CentralNeighborhoodController@findByCentral');
        Route::delete('{centralNeighborhood}', 'Central\CentralNeighborhoodController@delete');
    });

    Route::get('getBalance/{idBalance}', 'Central\CentralController@findByResponsible');

    /**
     * Rotas de voucher
     */
    Route::group(['prefix' => 'voucher'], function () {
        Route::post('generateChargePix', 'Voucher\VoucherController@generateChargePix');
        Route::post('buyWithCard', 'Voucher\VoucherController@buyWithCard');
    });

    Route::group(['prefix' => 'whatsapp-group'], function () {
        Route::post('store', 'Whatsapp\WhatsappGroupController@store');
        Route::get('index', 'Whatsapp\WhatsappGroupController@index');
        Route::put('update', 'Whatsapp\WhatsappGroupController@update');

        Route::group(['prefix' => 'notification'], function () {
            Route::post('store', 'Whatsapp\WhatsappGroupController@storeNotification');
            Route::get('index', 'Whatsapp\WhatsappGroupController@indexNotification');
        });
    });
});

Route::get('contact-support', 'Ifood\IfoodController@contactSupport');
Route::post('webhook/{centralId}', 'Ifood\IfoodController@handle');

Route::group(['prefix' => 'webhook/mobicity'], function () {
    Route::post('calculatePrice/{centralId}', 'Mobicity\MobicityController@calculatePrice');
    Route::post('newTrip/{centralId}', 'Mobicity\MobicityController@newTrip');
    Route::put('trip/{tripReference}/cancel', 'Trip\TripController@cancelByFlow');
});

Route::group(['prefix' => 'webhook/whatsapp'], function () {
    Route::get('customer/{centralId}/{phone}', 'Whatsapp\WhatsappController@findUserByPhoneAndCentral');
    Route::post('calculatePrice', 'Whatsapp\WhatsappController@calculatePrice');
    Route::post('newTrip', 'Whatsapp\WhatsappController@newTrip');
    Route::post('trip/{phone}/cancel', 'Whatsapp\WhatsappController@cancelTrip');
    Route::get('trip/{phone}', 'Whatsapp\WhatsappController@hasActiveTrip');
});
