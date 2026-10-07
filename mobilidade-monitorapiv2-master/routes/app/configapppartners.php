<?php

Route::group(['middleware' => 'auth:api'], function() {
    Route::group(['prefix' => 'config_app_partners'], function () {
      Route::post('', 'ConfigAppPartners\ConfigAppPartnersController@insert');
      Route::post('{id}', 'ConfigAppPartners\ConfigAppPartnersController@update');
      Route::delete('{id}', 'ConfigAppPartners\ConfigAppPartnersController@delete');
      Route::get('find_all', 'ConfigAppPartners\ConfigAppPartnersController@getAll');
      Route::get('find', 'ConfigAppPartners\ConfigAppPartnersController@getAllWithoutPagination');
    });
});
