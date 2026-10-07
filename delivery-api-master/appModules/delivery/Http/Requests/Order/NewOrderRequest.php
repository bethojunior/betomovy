<?php

namespace Delivery\Http\Requests\Order;

use Delivery\Constants\DeliveryOrder\OrderDeliveryTypeConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewOrderRequest extends FormRequest
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
            'companyId' => 'required|integer|exists:company,id',
            'value' => 'required|nullable|numeric',
            'deliveryFee' => 'sometimes|nullable|numeric',
            'placeId' => [
                'sometimes',
                'integer',
                'exists:places,idPlace',
                Rule::requiredIf(function ()  {
                    return $this->input('orderDeliveryTypeId') == OrderDeliveryTypeConst::DELIVERY;
                })
            ],
            'deliveryPaymentFormId' => 'required|integer|exists:deliveryPaymentForm,id',
            'deliveryItems' => 'required|array',
            'deliveryItems.*.quantity' => 'integer|min:1',
            'deliveryItems.*.deliveryProductId' => 'integer|exists:deliveryProduct,id',
            'deliveryItems.*.value' => 'required|numeric',
            'deliveryItems.*.obs' => 'sometimes|nullable|string',
            'deliveryItems.*.complements.*.quantity' => 'sometimes|integer',
            'deliveryItems.*.complements.*.deliveryComplementId' =>
                'sometimes|integer|exists:deliveryComplement,id',
            'userDiscountCouponDeliveryId'=> 'sometimes|integer',
            'changeValue'=> 'sometimes|numeric',
            'cardId' => 'sometimes|nullable|integer',
            'deliveryRateId' => 'sometimes|integer',
            'orderDeliveryTypeId' => 'sometimes|integer',
            'holderDocument' => 'sometimes|string',
        ];
    }
}
