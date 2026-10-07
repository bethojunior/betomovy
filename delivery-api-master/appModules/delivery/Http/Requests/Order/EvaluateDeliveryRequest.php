<?php


namespace Delivery\Http\Requests\Order;


use Illuminate\Foundation\Http\FormRequest;

class EvaluateDeliveryRequest extends FormRequest
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
            'deliveryOrderId' => 'required|integer|exists:deliveryOrder,id',
            'ratingOfTheEstablishment' => 'sometimes|nullable|numeric',
            'priceRange' => 'sometimes|nullable|numeric',
            'deliveryQuality' => 'sometimes|nullable|numeric'
        ];
    }
}
