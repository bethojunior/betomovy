<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/07/2020
 * Time: 16:39
 */

namespace Cash\Http\Requests\Sale;


use Illuminate\Foundation\Http\FormRequest;

class CompanyPayRequest extends FormRequest
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
            'salePaymentFormId' => 'required|integer|exists:salePaymentForm,id',
            'value' => 'required|numeric|min:0.01',
            'merchantId' => 'required|integer|exists:merchant,id'
        ];
    }
}
