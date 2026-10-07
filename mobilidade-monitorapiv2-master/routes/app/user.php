<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/09/2019
 * Time: 14:17
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {

    /**
     * Rotas para usuários em geral
     */
    Route::group(['prefix' => 'user'], function () {
        Route::delete('{id}', 'User\UserController@delete');
        Route::delete('{id}/central', 'User\UserController@deleteUserCentral');
        Route::put('{id}/observation', 'User\UserController@setObservation');
        Route::put('{id}/address', 'User\UserController@setAddress');
        Route::put('{id}/gender', 'User\UserController@setGender');
        Route::get('type/{userTypeId}', 'User\UserController@getByType');
        Route::put('{id}/changeType', 'User\UserController@changeType');
        Route::get('search', 'User\UserController@getAllUsers');
        Route::get('search/panel', 'User\UserController@getAllUsersPanel');
    });

    Route::group(['prefix' => 'admin'], function () {
        Route::get('', 'User\AdminController@index');
        Route::get('{id}', 'User\AdminController@show');
        Route::put('{id}', 'User\AdminController@update');
        Route::get('bills/{customerName}', 'User\AdminController@getBills');
        Route::post('', 'User\AdminController@store');
    });

    /**
     * Rotas para indicacao de usuarios
     */
    Route::group(['prefix' => 'userIndication'], function () {
        Route::group(['prefix' => 'user'], function () {
            Route::get('{userId}/referredUsers', 'User\UserIndicationReportController@referredUsers');
        });
    });

    /**
     * Rotas para tipos de usuário
     */
    Route::group(['prefix' => 'userType'], function (){
        Route::get('actives', 'User\UserTypeController@findAllActives');
        Route::post('', 'User\UserTypeController@insert');
        Route::delete('{id}', 'User\UserTypeController@delete');
        Route::post('{id}', 'User\UserTypeController@update');
        Route::put('{id}/enable', 'User\UserTypeController@enable');
        Route::put('{id}/disable', 'User\UserTypeController@disable');
        Route::get('{userTypeId}/requiredFields', 'User\RequiredFieldController@findByUserType');
        Route::get('drivers', 'User\UserTypeController@driversType');
        Route::put('{oldUserTypeId}/moveUsers/{newUserTypeId}', 'User\UserTypeController@moveUsers');
    });

    /**
     * Rotas para regras de usuários
     */
    Route::group(['prefix' => 'role'], function () {
        Route::get('permissions', 'Role\RoleUserPermissionsController@all');

        Route::get('{id?}', 'Role\RoleController@all');
        Route::put('{id}', 'Role\RoleController@update');
        Route::delete('{id}', 'Role\RoleController@delete');
        Route::post('', 'Role\RoleController@insert');

        Route::group(['prefix' => '{id}/city'], function (){
            Route::get('', 'Role\RoleCityController@all');
            Route::post('', 'Role\RoleCityController@insert');
            Route::delete('{cityId}', 'Role\RoleCityController@delete');
        });

        Route::delete('city/delete/{cityId}', 'Role\RoleCityController@deleteByCityId');
    });
    /**
     * Rotas de importação
     */
    Route::group(['prefix' => 'import'], function () {
        Route::group(['prefix' => 'customer'], function () {
            Route::post('', 'DataImport\ImportController@customer');
            Route::get('example', 'User\CustomerController@exampleImport');
        });
        Route::group(['prefix' => 'driver'], function () {
            Route::post('', 'DataImport\ImportController@driver');
            Route::get('example', 'User\DriverController@exampleImport');
        });
    });

    /**
     * Pendencias de clientes
     */
    Route::group(['prefix' => 'pendencyField'], function () {
        Route::post('', 'User\PendencyFieldController@insert');
        Route::put('{id}/updateStatus', 'User\PendencyFieldController@updateStatus');
        Route::delete('{id}', 'User\PendencyFieldController@delete');
        Route::get('user/{userId}', 'User\PendencyFieldController@getByUser');
    });

    /**
     * Rotas para dependentes do usuário
     */
    Route::get('user/{id}/dependentUser', 'User\DependentUserController@findByUser');

    /**
     * Rotas para documentos do motorista
     */
    Route::group(['prefix' => 'doc'], function () {
        Route::get('', 'User\Doc\DocController@all');
        Route::post('', 'User\Doc\DocController@insert');
        Route::put('{id}', 'User\Doc\DocController@update');
        Route::delete('{id}', 'User\Doc\DocController@delete');

        Route::group(['prefix' => 'userType'], function () {
            Route::get('{userTypeId}', 'User\Doc\DocUserTypeController@findAll');
            Route::post('{userTypeId}', 'User\Doc\DocUserTypeController@insert');
        });
    });

    Route::group(['prefix' => 'docUserType'], function () {
        Route::delete('{id}', 'User\Doc\DocUserTypeController@delete');
    });

    Route::get('docStatus', 'User\Doc\DocStatusController@all');

    Route::group(['prefix' => 'docUser'], function () {
        Route::post('', 'User\Doc\DocUserController@insert');
        Route::put('{id}', 'User\Doc\DocUserController@updateStatus');
        Route::post('{id}/image', 'User\Doc\DocUserController@uploadImage');
        Route::delete('{id}', 'User\Doc\DocUserController@delete');
        Route::get('user/{id}', 'User\Doc\DocUserController@findByUser');
    });

    Route::group(['prefix' => 'partner'], function () {
        Route::get('', 'User\PartnerController@findAll');
    });

    /**
     * Rotas remocão de dados do usuario
     */
    Route::get('user/removeAccountsRequest', 'User\UserController@listAllRemoveAccountRequest');
    Route::put('user/{userId}/removeAccountUser', 'User\UserController@removeAccountUser');
    Route::put('user/{userId}/cancelRemoveAccountUser', 'User\UserController@cancelRemoveAccountUser');
});
