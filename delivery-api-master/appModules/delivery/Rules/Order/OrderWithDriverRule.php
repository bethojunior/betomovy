<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2020
 * Time: 17:32
 */

namespace Delivery\Rules\Order;


use Delivery\Models\Order\DeliveryOrder;
use Illuminate\Contracts\Validation\Rule;

class OrderWithDriverRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if (!$value instanceof DeliveryOrder)
            return false;

        return $value->driverId ? false : true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Pedido já foi aceito';
    }
}
