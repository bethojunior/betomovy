<?php


namespace App\Http\Requests\Promotion;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DiscountCouponDeliveryRequest extends FormRequest
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
            'code' => 'required|string',
            'value' => 'required|numeric',
            'fromValue' => 'required|numeric',
            'dateStart' => 'required',
            'dateEnd' => 'required',
            'companyId' => 'required|integer|exists:company,id',
            'valueType' => [
                'required',
                Rule::in(['$','%'])
            ]
        ];
    }

}
