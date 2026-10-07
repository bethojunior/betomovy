<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/07/2020
 * Time: 09:55
 */

namespace Api\Http\Requests\Order;


use Api\Rules\Order\OrderInStatusRule;
use Common\Constants\DeliveryOrderStatusConstant;
use Illuminate\Foundation\Http\FormRequest;

class RefuseOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'deliveryOrder' => [
                new OrderInStatusRule(DeliveryOrderStatusConstant::WAITING_CONFIRMATION),
            ]
        ];
    }

    /**
     * Add parameters to be validated
     *
     * @param null $keys
     * @return array
     */
    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }
}
