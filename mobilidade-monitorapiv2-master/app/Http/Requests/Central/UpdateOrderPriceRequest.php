<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderPriceRequest extends FormRequest
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
            'cityId' => 'required|integer|min:1',
            'orders' => 'required|array|min:1',
            'orders.*.id' => 'required|integer|min:1',
            'orders.*.order' => 'required|integer|min:1',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'cityId.required' => 'O cityId é obrigatório',
            'cityId.integer' => 'O cityId deve ser um número inteiro',
            'cityId.min' => 'O cityId deve ser maior que zero',
            'orders.required' => 'A lista de orders é obrigatória',
            'orders.array' => 'Orders deve ser um array',
            'orders.min' => 'Deve haver pelo menos um item na lista de orders',
            'orders.*.id.required' => 'O ID é obrigatório para cada item',
            'orders.*.id.integer' => 'O ID deve ser um número inteiro',
            'orders.*.id.min' => 'O ID deve ser maior que zero',
            'orders.*.order.required' => 'A ordem é obrigatória para cada item',
            'orders.*.order.integer' => 'A ordem deve ser um número inteiro',
            'orders.*.order.min' => 'A ordem deve ser maior que zero',
        ];
    }
}
