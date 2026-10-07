<?php

Route::group(['middleware' => 'auth:api'], function () {
    Route::group(['prefix' => 'list_contacts_general'], function () {
        Route::post('insert', 'ListContacts\ListContactsGeneralController@insert');
        Route::get('list', 'ListContacts\ListContactsGeneralController@get');
        Route::delete('delete/{id}', 'ListContacts\ListContactsGeneralController@delete');
    });
});
