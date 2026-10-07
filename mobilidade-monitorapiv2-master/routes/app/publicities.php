<?php

Route::group(['middleware' => 'auth:api'], function() {
    Route::group(['prefix' => 'publicity'], function (){
        Route::get('advertising/customer', 'Publicities\PublicityController@getPublicities');
    });
});
