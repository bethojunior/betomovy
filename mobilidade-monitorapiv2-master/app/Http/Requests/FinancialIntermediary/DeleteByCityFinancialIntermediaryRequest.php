<?php

namespace App\Http\Requests\FinancialIntermediary;

use Illuminate\Foundation\Http\FormRequest;

class DeleteByCityFinancialIntermediaryRequest extends FormRequest
{
    public function rules()
    {
        return [
            'metadata' => 'required|array',
            'metadata.*.key' => 'required|string|exists:acquirerMetaData,key',
            'metadata.*.cityId' => 'required|integer',
        ];
    }

    public function attributes()
    {
        return [
            'metadata' => 'credenciais'
        ];
    }
}
