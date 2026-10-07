<?php

namespace App\Http\Requests\FinancialIntermediary;


use Illuminate\Foundation\Http\FormRequest;

class FinancialIntermediaryRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'metadata' => 'required|array',
            'metadata.*.key' => 'required|string|exists:acquirerMetaData,key',
            'metadata.*.value' => 'required|string',
        ];
    }

    public function attributes()
    {
        return [
            'metadata' => 'credenciais'
        ];
    }
}
