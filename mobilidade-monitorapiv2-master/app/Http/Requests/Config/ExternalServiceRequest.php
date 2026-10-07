<?php


namespace App\Http\Requests\Config;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExternalServiceRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'active' => 'sometimes|nullable|boolean',
            'metadata' => 'required|array',
            'metadata.*.key' => [
                'required',
                'string',
                'distinct',
                Rule::in(array_column($this->externalService->externalServiceMetaData->toArray(), 'key'))
            ],
            'metadata.*.value' => 'nullable|string',
        ];
    }

    public function attributes()
    {
        return [
            'metadata' => 'credenciais'
        ];
    }
}
