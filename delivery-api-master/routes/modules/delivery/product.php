<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/06/2020
 * Time: 09:43
 */

/**
 * Rotas para listagem de empresas delivery
 */
Route::group(['prefix' => 'product'], function () {
    Route::get('{deliveryProduct}', 'Product\DeliveryProductController@find');
});
