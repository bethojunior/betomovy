<?php

Route::group(['prefix' => 'section'], function () {
    Route::get('', 'Delivery\DeliverySectionController@findAll');
});
