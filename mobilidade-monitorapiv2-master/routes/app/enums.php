<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/09/2019
 * Time: 16:57
 */

Route::group(['middleware' => 'auth:api'], function() {
    /**
     * Rotas de enums
     */

    Route::get('city', 'Locale\CityController@all');
    Route::get('estate', 'Locale\EstateController@all');
    Route::get('weekDays', 'Enum\WeekDayController@all');
    Route::get('bank', 'Enum\BankController');
    Route::get('companyRegisterStatus', 'Company\CompanyRegisterStatusController@all');
    Route::get('gender', 'Enum\GenderController@all');
    Route::get('app', 'Platform\AppController@all');
    Route::get('userGroup', 'Role\UserGroupController@all');
    Route::get('routePitStopType', 'Enum\RoutePitStopTypeController@all');
    Route::get('pendencyFieldType', 'User\PendencyFieldTypeController@all');
    Route::get('pendencyFieldStatus', 'User\PendencyFieldStatusController@all');
    Route::get('militaryForce', 'Military\MilitaryForceController@all');
    Route::get('militaryForceGraduation', 'Military\MilitaryForceGraduationController@all');
    Route::get('militaryStatus', 'Military\MilitaryStatusController@all');
    Route::get('customerRegisterStatus', 'Enum\CustomerRegisterStatusController@all');
});
