<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/07/2020
 * Time: 09:05
 */

namespace Delivery\Http\Requests\Order;


use App\Constants\Delivery\DeliveryOrderStatusConst;
use Delivery\Rules\Order\OrderInStatusRule;
use Illuminate\Foundation\Http\FormRequest;

class CancelOrderByDriverRequest extends FormRequest
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
                new OrderInStatusRule(DeliveryOrderStatusConst::ORDER_ACCEPTED_DELIVERY_MAN),
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
