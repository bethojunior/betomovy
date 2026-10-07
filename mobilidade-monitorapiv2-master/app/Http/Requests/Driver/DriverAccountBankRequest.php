<?php

namespace App\Http\Requests\Driver;


use Illuminate\Foundation\Http\FormRequest;

class DriverAccountBankRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        return [
            'tripPaymentForms' => 'nullable|array',
            'tripPaymentForms.*' => 'integer'
        ];
    }

    public function attributes()
    {
        return [
            'tripPaymentForms' => 'formas de pagamento'
        ];
    }
}
