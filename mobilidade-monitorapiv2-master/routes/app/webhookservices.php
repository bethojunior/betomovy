<?php
/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {

    /**
     * Rotas para webhook services
     */
    Route::group(['prefix' => 'webhook'], function () {
        Route::get('', 'WebhookServices\WebhookServicesController@findAll');
        Route::get('{id}/show', 'WebhookServices\WebhookServicesController@findOne');
        Route::post('', 'WebhookServices\WebhookServicesController@insert');
        Route::delete('{id}', 'WebhookServices\WebhookServicesController@delete');
        Route::post('{id}/deactivating', 'WebhookServices\WebhookServicesController@setInactiveWebhook');
        Route::post('{id}/activating', 'WebhookServices\WebhookServicesController@setActiveWebhook');
        Route::patch('{id}', 'WebhookServices\WebhookServicesController@update');
        Route::get('typesServices', 'WebhookServices\WebhookServicesController@findAllServicesWebhooks');
    });
});
