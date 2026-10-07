<?php

namespace App\Http\Requests\Balance;

use Illuminate\Foundation\Http\FormRequest;

class CreditPrepaidRequest extends FormRequest
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
            'stripe' => 'required|string|max:45',
            'title' => 'required|string|max:45',
            'superTitle' => 'required|string|max:45',
            'purchasePrice' => 'sometimes|nullable|numeric',
            'sellPrice' => 'required|numeric',
            'accountInformation' => 'sometimes|string',
            'paymentForms' => 'required|array',
            'paymentForms.*' => 'int|exists:paymentForm,idPaymentForm',
            'type' =>  'required|string',
            'quantityDaysSold' => 'sometimes|nullable|numeric|integer',
            'quantityDaysPurchased' => 'sometimes|nullable|numeric|integer',
            'cityId' => 'sometimes|nullable|numeric|integer'
        ];
    }

    public function attributes()
    {
        return [
            'paymentForms' => 'formas de pagamento',
            'paymentForms.*' => 'formas de pagamento',
            'stripe' => 'tarjeta',
            'title' => 'título',
            'purchasePrice' => 'preço de compra',
            'sellPrice' => 'preço de venda',
            'accountInformation' => 'informções da conta',
            'type' => 'tipo',
            'quantityDaysSold' => 'dias vendidos',
            'quantityDaysPurchased' => 'dias comprados',
            'cityId' => 'cidade'
        ];
    }
}
