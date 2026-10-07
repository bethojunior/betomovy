<?php

Route::group(['middleware' => 'auth:api'], function() {
    Route::group(['prefix' => 'config_list_phone_general'], function () {
      Route::get('config', 'ConfigListContacts\ConfigListContactsGeneralController@getConfigListContacts');
      Route::put('config/{id}', 'ConfigListContacts\ConfigListContactsGeneralController@updateConfigListContacts');
    });
});
