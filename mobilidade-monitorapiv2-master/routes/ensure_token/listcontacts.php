<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'list_contacts_general'], function () {
    Route::post('insertContacts', 'ListContacts\ListContactsGeneralController@insert');
});
