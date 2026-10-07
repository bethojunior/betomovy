<?php

namespace App\Http\Requests\Delivery;

use Illuminate\Foundation\Http\FormRequest;

class DeliveryChargeRequest extends FormRequest
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
            'monthlyFixedValue' => 'sometimes|nullable|numeric',
            'monthlyFixedDay' => 'required_with:monthlyFixedValue|integer|max:28',
            'orderFixedValue' => 'sometimes|nullable|numeric',
            'orderPercentageValue' => 'sometimes|nullable|numeric',
        ];
    }

    public function attributes()
    {
        return [
            "monthlyFixedValue" => "valor fixo mensal",
            "monthlyFixedDay" => "dia de cobrança mensal",
            "orderFixedValue" => "valor de cobrança fixo por pedido",
            "orderPercentageValue" => "valor da porcentagem de cobrança por pedido",
        ];
    }
}
