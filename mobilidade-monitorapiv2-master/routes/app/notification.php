<?php
/**
 * Created by PhpStorm.
 * User: Betho Junior
 * Date: 30/10/2019
 * Time: 10:27
 */

/*
|---------------------------------------------------------------------------
| Private Routes
|---------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function() {

    /**
     * Rotas para Notificações
     */
    Route::group(['prefix' => 'notification'], function () {
        Route::get('', 'Notification\NotificationController@findAll');
        Route::post('/', 'Notification\NotificationController@insert');
        Route::post('store', 'Notification\NotificationController@store');
        Route::delete('{notification}', 'Notification\NotificationController@delete');
    });

    /**
     * Rotas para Notificações de administradores
     */
    Route::group(['prefix' => 'adminNotification'], function () {
        Route::get('', 'Notification\AdminNotificationController@all');
        Route::get('last', 'Notification\AdminNotificationController@findLast');
        Route::post('{id}/view', 'Notification\AdminNotificationController@markViewed');
        Route::post('markAllAsRead', 'Notification\AdminNotificationController@markAllAsRead');
        Route::post('{adminNotification}/read', 'Notification\AdminNotificationController@markRead');
        Route::delete('clearingNotification', 'Notification\AdminNotificationController@clearingNotification');
    });

    Route::group(['prefix' => 'adminNotificationType'], function () {
        Route::get('', 'Notification\AdminNotificationTypeController@all');
    });

    Route::group(['prefix' => 'eventNotification'], function(){
        Route::get('types', 'Notification\EventNotificationController@findTypes');
        Route::post('', 'Notification\EventNotificationController@store');
        Route::get('', 'Notification\EventNotificationController@findAll');
        Route::delete('{id}', 'Notification\EventNotificationController@delete');
    });
});
