<?php


namespace App\Http\Requests\FinancialIntermediary;


use Illuminate\Foundation\Http\FormRequest;

class UpdateByCityFinancialIntermediaryRequest extends FormRequest
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
