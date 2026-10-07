<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/07/2020
 * Time: 15:57
 */

Route::group(['middleware' => 'auth:api'], function() {
    /**
     * Buscando usuários por contato
     */
    Route::post('listUsersByContacts', 'Customer\CustomerController@listByPhoneList');
});
