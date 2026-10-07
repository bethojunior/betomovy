<?php

namespace App\Http\Requests\Sale;

use Illuminate\Foundation\Http\FormRequest;

class SaleTripRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'cityId' => 'required|exists:city,id',
            'label' => 'required',
            'quantity' => 'required|integer',
            'startDay' => 'required|date',
            'endDay' => 'required|date',
            'status' => 'required',
            'type' => 'required|in:voucher,trip',
            'limitedTo' => 'sometimes|nullable|numeric',
            'tripPaymentFormId' => 'sometimes|nullable|integer'
        ];
    }

    public function messages()
    {
        return [

        ];
    }
}
