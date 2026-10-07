<?php

namespace App\Http\Requests\Driver;

use Illuminate\Foundation\Http\FormRequest;

class DriverAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'zipCode'      => 'required|string',
            'street'       => 'required|string',
            'number'       => 'required|string',
            'neighborhood' => 'required|string',
            'complement'   => 'nullable|string',
            'cityId'       => 'required|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'zipCode.required'      => 'O campo CEP é obrigatório.',
            'street.required'       => 'O campo Rua é obrigatório.',
            'number.required'       => 'O campo Número é obrigatório.',
            'neighborhood.required' => 'O campo Bairro é obrigatório.',
            'cityId.required'       => 'O campo Cidade é obrigatório.',
        ];
    }
}
