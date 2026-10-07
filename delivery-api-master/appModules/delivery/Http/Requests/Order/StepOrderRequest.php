<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/07/2020
 * Time: 10:56
 */

namespace Delivery\Http\Requests\Order;


use App\Constants\Delivery\DeliveryOrderStatusConst;
use Delivery\Rules\Order\OrderInStatusRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StepOrderRequest extends FormRequest
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

    public function rules()
    {
        switch ($this->route()->getName()) {
            case 'step.refuse':
                return [
                    'deliveryOrder' =>
                        new OrderInStatusRule(DeliveryOrderStatusConst::SEARCHING_DELIVERY_MAN)
                ];

            case 'step.informArrival':
                return [
                    'deliveryOrder' =>
                        new OrderInStatusRule(DeliveryOrderStatusConst::ORDER_ACCEPTED_DELIVERY_MAN)
                ];

            case 'step.goOutForDelivery':
                return [
                    'deliveryOrder' =>
                        new OrderInStatusRule(DeliveryOrderStatusConst::WITHDRAWING_ORDER)
                ];

            case 'step.arriveOnDelivery':
                return [
                    'deliveryOrder' =>
                        new OrderInStatusRule(DeliveryOrderStatusConst::OUT_FOR_DELIVERY)
                ];

            case 'step.deliver':
                return [
                    'deliveryOrder' =>
                        new OrderInStatusRule(DeliveryOrderStatusConst::ARRIVED)
                ];

            case 'step.return':
                return [
                    'deliveryOrder' =>
                        new OrderInStatusRule(DeliveryOrderStatusConst::DELIVERED)
                ];

            case 'step.finish':
                return [
                    'deliveryOrder' =>
                        new OrderInStatusRule(
                            DeliveryOrderStatusConst::DELIVERED,
                            DeliveryOrderStatusConst::RETURNING
                        )
                ];

            default:
                return [];
        }
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
