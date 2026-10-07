<?php

namespace App\Http\Requests\FinancialIntermediary;

use Illuminate\Foundation\Http\FormRequest;

class DeliveryFinancialIntermediaryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'metadata' => 'required|array',
            'metadata.*.key' => 'required|string|exists:deliveryAcquirerMetaData,key',
            'metadata.*.value' => 'required|string',
        ];
    }

    public function attributes(): array
    {
        return [
            'metadata' => 'credenciais'
        ];
    }
}
