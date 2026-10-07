<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/09/2019
 * Time: 16:54
 */


Route::group(['middleware' => 'auth:api'], function () {
    /**
     * Rotas de config
     */
    Route::group(['prefix' => 'config'], function () {
        /**
         * Rotas para informações de tipos de viagens
         */
        Route::group(['prefix' => 'textTripTypes'], function () {
            Route::get('', 'Config\ConfigController@getTripTypesText');
            Route::put('', 'Config\ConfigController@updateTripTypesText');
        });

        /**
         * Rotas para configuracao de chamado pelo firebase
         */
        Route::get('realtimeDatabase', 'Config\ConfigController@getRealtimeDatabase');
        Route::put('updateRealtimeDatabase', 'Config\ConfigController@toggleRealtimeDatabase');

        Route::get('', 'Config\ConfigController@findAll');
        Route::put('', 'Config\ConfigController@update');
        Route::get('type/{idConfigType}', 'Config\ConfigController@findByType');
        Route::get('additional', 'Config\ConfigController@getAdditionalConfigs');

        /**
         * Rotas para campos do motorista
         */
        Route::group(['prefix' => 'formStep'], function () {
            Route::get('', 'Config\FormStep\FormStepController@all');
            Route::get('userType/{userTypeId}', 'Config\FormStep\FormStepUserTypeController@findByUserType');
        });
        Route::group(['prefix' => 'formStepUserType'], function () {
            Route::post('', 'Config\FormStep\FormStepUserTypeController@insert');
            Route::delete('{id}', 'Config\FormStep\FormStepUserTypeController@delete');
        });

        Route::get('location', 'Config\CityConfigController@getConfig');
        Route::get('delivery', 'Config\ConfigController@findDeliveryConfigs');
        Route::get('{key}', 'Config\ConfigController@findByKey');
        Route::post('terms', 'Config\ConfigController@updateTerms');
        Route::put('appSharingCustomerMessage', 'Config\ConfigController@updateAppSharingCustomerMessage');
        Route::put('appSharingDriverMessage', 'Config\ConfigController@updateAppSharingDriverMessage');
        Route::put('billingDate', 'Config\ConfigController@updateBillingDate');
        Route::put('codePhoneCountry', 'Config\ConfigController@updateCodePhoneCountry');
        Route::put('enableBuyVoucher', 'Config\ConfigController@updateEnableBuyVoucher');
    });

    Route::get('requiredField/customer', 'User\RequiredFieldController@findFromCustomer');
    Route::put('requiredField/customer/{requiredFieldId}', 'User\RequiredFieldController@update');
    Route::put('requiredField/changeConfirmationCode', 'User\RequiredFieldController@changeConfirmationCode');
    Route::get('requiredField/confirmationCodeCustomer', 'User\RequiredFieldController@getTypeConfirmationCodeCustomer');

    /**
     * Rotas para alterações de preço
     */
    Route::group(['prefix' => 'priceHelp'], function () {
        Route::get('', 'Price\PriceHelpController@findAll');
    });

    /**
     * Rotas para alterações de pagamento da viagem
     */
    Route::get('paymentFormType', 'Config\PaymentFormTypeController@findShowable');
    Route::get('paymentFormType/general', 'Config\PaymentFormTypeController@findOnlyGeneral');

    Route::get('tripPaymentForm', 'Trip\TripPaymentFormController@all');
    Route::post('tripPaymentForm', 'Trip\TripPaymentFormController@insert');
    Route::delete('tripPaymentForm/{id}', 'Trip\TripPaymentFormController@delete');
    Route::put('tripPaymentForm/{id}', 'Trip\TripPaymentFormController@edit');
    Route::put('tripPaymentForm/{id}/enable', 'Trip\TripPaymentFormController@enable');
    Route::put('tripPaymentForm/{id}/disable', 'Trip\TripPaymentFormController@disable');

    Route::group(['prefix' => 'deliveryPaymentForm'], function () {
        Route::get('', 'Delivery\DeliveryPaymentFormController@index');
        Route::post('', 'Delivery\DeliveryPaymentFormController@insert');
        Route::put('{deliveryPaymentForm}', 'Delivery\DeliveryPaymentFormController@update');
        Route::delete('{deliveryPaymentForm}', 'Delivery\DeliveryPaymentFormController@delete');
    });

    Route::get('paymentForm', 'Config\PaymentFormController@all');

    /**
     * Configurações de endereço
     */
    Route::group(['prefix' => 'address'], function () {
        Route::post('', 'Config\AddressController@insert');
        Route::get('', 'Config\AddressController@findAll');
        Route::put('{id}', 'Config\AddressController@update');
        Route::delete('{id}', 'Config\AddressController@delete');
        Route::post('cache', 'Config\AddressController@cacheAddress');
    });

    /**
     * Configuração de blacklist
     */
    Route::group(['prefix' => 'addressBlacklist'], function () {
        Route::get('', 'Config\AddressBlacklistController@findAll');
        Route::post('', 'Config\AddressBlacklistController@insert');
        Route::put('{addressBlacklist}/approve', 'Config\AddressBlacklistController@approve');
        Route::put('{addressBlacklist}/refuse', 'Config\AddressBlacklistController@refuse');
        Route::delete('{addressBlacklist}', 'Config\AddressBlacklistController@delete');
    });

    /**
     * Configuração dos envios de códigos e sms's
     */
    Route::get('externalServiceAction', 'ExternalService\ExternalServiceActionController@index');
    Route::get('externalServiceType', 'ExternalService\ExternalServiceTypeController@index');
    Route::get('externalServiceGroup', 'ExternalService\ExternalServiceGroupController@index');
    Route::get('externalServiceType/fully', 'ExternalService\ExternalServiceTypeController@findFully');

    Route::group(['prefix' => 'externalServiceActive'], function () {
        Route::get('', 'ExternalService\ExternalServiceActiveController@findAll');
        Route::put('{externalServiceActive}',
            'ExternalService\ExternalServiceActiveController@updateExternalServiceType');
    });

    Route::group(['prefix' => 'externalServiceActiveChannel'], function () {
        Route::get('', 'ExternalService\ExternalServiceActiveChannelController@findAll');
        Route::put('{externalServiceActiveChannel}',
            'ExternalService\ExternalServiceActiveChannelController@updateExternalServiceType');
    });

    Route::group(['prefix' => 'externalService'], function () {
        Route::get('sms', 'ExternalService\ExternalServiceController@findAllTypeSms');
        Route::get('sms/city', 'ExternalService\ExternalServiceController@findAllTypeSmsByCity');
        Route::put('{externalService}', 'ExternalService\ExternalServiceController@update');
        Route::put('{externalService}/city', 'ExternalService\ExternalServiceController@updateByCity');
        Route::post('sendSmsTest', 'ExternalService\ExternalServiceController@sendSmsTest');
    });

    Route::group(['prefix' => 'acquirer'], function () {
        Route::get('', 'FinancialIntermediary\FinancialIntermediaryController@findAll');
        Route::get('city', 'FinancialIntermediary\FinancialIntermediaryController@findAllByCity');
        Route::put('city',
            'FinancialIntermediary\FinancialIntermediaryController@updateByCity');
        Route::put('city/delete',
            'FinancialIntermediary\FinancialIntermediaryController@deleteByCity');
        Route::put('{financialIntermediary}',
            'FinancialIntermediary\FinancialIntermediaryController@update');
    });

    Route::group(['prefix' => 'deliveryAcquirer'], function () {
        Route::get('', 'FinancialIntermediary\DeliveryFinancialIntermediaryController@findAll');
        Route::put('{deliveryFinancialIntermediary}', 'FinancialIntermediary\DeliveryFinancialIntermediaryController@update');
    });

    Route::group(['prefix' => 'mapService'], function () {
        Route::get('', 'MapService\MapServiceController@findAll');
        Route::get('types', 'MapService\MapServiceController@findWithMetaData');
        Route::post('', 'MapService\MapServiceController@store');
        Route::get('{groupCode}/disable', 'MapService\MapServiceController@disableByGroup');
    });

    Route::group(['prefix' => 'termsUsePolicy'], function () {
        Route::get('', 'Config\TermsUsePolicyController@findAll');
        Route::get('findByType', 'Config\TermsUsePolicyController@findByType');
        Route::post('update', 'Config\TermsUsePolicyController@update');
    });

    Route::get('databaseVersion', 'Config\DatabaseVersionController@get');

    Route::group(['prefix' => 'smtpServer'], function () {
        Route::post('', 'Config\SMTPServerController@store');
        Route::get('', 'Config\SMTPServerController@findAllActive');
        Route::post('test', 'Config\SMTPServerController@testSmtp');
        Route::put('disable', 'Config\SMTPServerController@disable');
        Route::put('{id}/remove', 'Config\SMTPServerController@removeSmtpServer');
        Route::get('{id}/edit', 'Config\SMTPServerController@editSmtpServer');
        Route::put('{id}/update', 'Config\SMTPServerController@updateSmtpServer');
    });

    Route::group(['prefix' => 'riskArea'], function(){
        Route::get('', 'Config\RiskAreaController@findAll');
        Route::put('{id}', 'Config\RiskAreaController@confirm');
        Route::delete('{id}', 'Config\RiskAreaController@refuse');
    });

    Route::group(['prefix' => 'webMapKey'], function(){
        Route::get('', 'Config\WebMapKeyController@findAll');
        Route::post('', 'Config\WebMapKeyController@store');
        Route::delete('{id}', 'Config\WebMapKeyController@delete');
    });

    Route::group(['prefix' => 'firestore'], function(){
        Route::delete('cleanCollection','Config\FirestoreController@cleanAllTripCollection');
        Route::get('check','Config\FirestoreController@checkRealtime');
    });

    Route::group(['prefix' => 'integration-partners'], function(){
        Route::get('', 'Config\IntegrationPartnersController@findAll');
        Route::post('', 'Config\IntegrationPartnersController@create');
        Route::put('{id}', 'Config\IntegrationPartnersController@update');
        Route::delete('{id}', 'Config\IntegrationPartnersController@delete');
    });
});
