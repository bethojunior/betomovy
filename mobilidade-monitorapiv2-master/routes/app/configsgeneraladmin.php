<?php

Route::group(['middleware' => 'auth:api'], function() {
    Route::get('configs_general_admin/{key}', 'ConfigsGeneralAdmin\ConfigsGeneralAdminController@getConfigsGeneralAdmin');
});
