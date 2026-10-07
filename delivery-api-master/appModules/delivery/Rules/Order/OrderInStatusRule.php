<?php

namespace Delivery\Rules\Order;

use App\Constants\Delivery\DeliveryOrderStatusConst;
use Delivery\Models\Order\DeliveryOrder;
use Illuminate\Contracts\Validation\Rule;

class OrderInStatusRule implements Rule
{
    /**
     * @var array
     */
    private $filterStatus;

    /**
     * Create a new rule instance.
     *
     * @param array $filterStatus
     */
    public function __construct(int ...$filterStatus)
    {
        $this->filterStatus = $filterStatus;
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

        return in_array($value->deliveryOrderStatusId, $this->filterStatus);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Status do pedido não permite esta ação';
    }
}
