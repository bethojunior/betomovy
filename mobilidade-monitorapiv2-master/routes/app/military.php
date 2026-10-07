<?php
/**
 * Created by PhpStorm.
 * User: Luid Sousa
 * Date: 09/11/2020
 * Time: 16:53
 */

Route::group(['middleware' => 'auth:api'], function() {
    Route::group(['prefix' => 'militaryForceGraduation'], function (){
        Route::get('', 'Military\MilitaryForceGraduationController@all');
        Route::get('{id}', 'Military\MilitaryForceGraduationController@find');
        Route::post('', 'Military\MilitaryForceGraduationController@store');
        Route::put('{militaryForceGraduation}', 'Military\MilitaryForceGraduationController@update');
        Route::delete('{militaryForceGraduation}', 'Military\MilitaryForceGraduationController@delete');
    });
    Route::group(['prefix' => 'militaryForce'], function (){
        Route::get('', 'Military\MilitaryForceController@all');
        Route::post('', 'Military\MilitaryForceController@store');
    });
});
