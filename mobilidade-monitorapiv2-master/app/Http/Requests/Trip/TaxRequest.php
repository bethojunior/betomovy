<?php

namespace App\Http\Requests\Trip;

use Illuminate\Foundation\Http\FormRequest;

class TaxRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rulesByMethod = [
            'POST' => [
                'name' => 'required|string',
                'value' => 'required|numeric',
                'valueType' => 'required|in:$,%',
                'description' => 'sometimes|nullable|string',
                'cityId' => 'required|integer',
                'tripTypeId' => 'required|integer',
                'chargeBy' => 'required|in:customer,driver',
                'active' => 'sometimes|boolean',
            ],
            'PUT' => [
                'name' => 'sometimes|string',
                'value' => 'sometimes|numeric',
                'valueType' => 'sometimes|in:$,%',
                'description' => 'sometimes|nullable|string',
                'cityId' => 'sometimes|integer',
                'tripTypeId' => 'sometimes|integer',
                'chargeBy' => 'sometimes|in:customer,driver',
                'active' => 'sometimes|boolean',
            ],
        ];

        return $rulesByMethod[$this->method()];
    }
}
