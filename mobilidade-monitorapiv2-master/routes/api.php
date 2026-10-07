<?php


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

use Illuminate\Support\Facades\Route;

Route::post('login', 'User\AuthenticationController@authentication');
Route::post('companyLogin', 'User\AuthenticationController@authenticationCompany');
Route::post('companyPreRegister', 'Company\CompanyRegisterController@preRegister');
Route::get('activeCities', 'Locale\CityController@actives');
Route::post('user/forgetPassword', 'User\UserController@forgetPassword');
Route::put('user/{id}/password', 'User\UserController@setPassword');
Route::post('whatsapp/test', 'WhatsApp\WhatsAppController@handle');
Route::post('whatsapp/send_many', 'WhatsApp\WhatsAppController@handleSendMany');

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/
Route::group(['middleware' => ['ensure.token']], function () {
    Route::middleware('api')
        ->group(base_path('routes/ensure_token/ensure_token.php'));
});

Route::prefix('audit')->middleware('audit.token')->group(function () {
    Route::get('/trip/{driverId}', 'Trip\TripController@findCurrentByDriver');
    Route::get('/driver/{driverId}', 'User\DriverController@findOne');
    Route::get('/driver/plate/{plate}', 'Trip\TripController@findOneByCarPlate');
});

Route::group(['middleware' => ['audit', 'config.redis']], function () {
    Route::middleware('api')
        ->group(base_path('routes/app/city.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/config.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/freight.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/delivery.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/user.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/trip.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/driver.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/customer.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/balance.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/monetization.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/accessibility.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/price.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/company.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/advertising.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/report.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/enums.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/notification.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/route.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/central.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/sales.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/locale.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/military.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/promotion.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/app.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/routeAudit.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/establishment.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/dashboard.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/contact.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/userPenalty.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/asaas.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/manager.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/publicities.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/auth.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/helpersvideos.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/configsgeneraladmin.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/logsMongo.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/publicitiesApp.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/webhookservices.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/callgroup.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/monitoringArea.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/configapppartners.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/listcontacts.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/configlistcontacts.php'));
    Route::middleware('api')
        ->group(base_path('routes/app/managmentwppgroupnotification.php'));
});
