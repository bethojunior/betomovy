<?php
/**
 * Created by PhpStorm.
 * User: Luid Sousa
 * Date: 12/01/2021
 * Time: 13:57
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {

    Route::group(['prefix' => 'internalAuditCategory'], function () {
        Route::get('', 'RouteAudit\InternalAuditCategoryController@findAll');
        Route::get('{id}/requests', 'RouteAudit\InternalAuditCategoryController@findRequestsByCategory');
        Route::get('{id}', 'RouteAudit\InternalAuditCategoryController@find');
        Route::post('', 'RouteAudit\InternalAuditCategoryController@save');
        Route::put('{internalAuditCategory}', 'RouteAudit\InternalAuditCategoryController@update');
        Route::delete('{id}', 'RouteAudit\InternalAuditCategoryController@delete');
    });
});
