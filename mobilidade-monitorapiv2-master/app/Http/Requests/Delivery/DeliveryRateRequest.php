<?php


namespace App\Http\Requests\Delivery;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DeliveryRateRequest extends FormRequest
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
            'range' => 'required|integer',
            'tax' => 'required|numeric',
            'time' => 'required|integer',
            'cityId' => 'required|integer',
            'deliveryServiceFee' => 'required|numeric',
            'deliveryServiceFeeType' => [
                'required',
                Rule::in(['%', '$'])
            ]
        ];
    }
}
