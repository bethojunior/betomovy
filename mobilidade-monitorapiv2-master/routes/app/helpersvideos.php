<?php

Route::group(['middleware' => 'auth:api'], function() {
    Route::get('helpersVideos', 'HelpersVideos\HelpersVideosController@getHelpers');
});