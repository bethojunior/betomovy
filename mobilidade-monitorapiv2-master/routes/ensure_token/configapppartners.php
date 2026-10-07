<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'config_app_partners'], function () {
  Route::get('get_all', 'ConfigAppPartners\ConfigAppPartnersController@getAll');
});
