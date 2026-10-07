<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'webhooks'], function () {
  Route::get('getWebhooks', 'WebhookServices\WebhookServicesController@findAllWithoutPagination');
});
