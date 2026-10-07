<?php

namespace App\Http\Requests\Locale;

use Illuminate\Foundation\Http\FormRequest;

class EstateRequest extends FormRequest
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
        switch ($this->method()){
            case 'GET':
            case 'DELETE':
            {
                break;
            }
            case 'POST':
            {
                return [
                    'nome' => 'required|string|unique:estate',
                    'sigla' => 'required|string',
                    'countryId' => 'required|integer',
                    'statusId' => 'sometimes|integer'
                ];
            }
            case 'PUT':
            case 'PATCH':
            {
                return [
                    'nome' => 'sometimes|string',
                    'sigla' => 'sometimes|string',
                    'countryId' => 'sometimes|integer'
                ];
            }
            default:
                break;
        }
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O campo estado é obrigatório',
            'nome.unique' => 'Já existe um estado com esse nome',
            'sigla.required' => 'O campo sigla é obrigatório'
        ];
    }
}
