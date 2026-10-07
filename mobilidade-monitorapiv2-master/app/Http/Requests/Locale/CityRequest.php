<?php

namespace App\Http\Requests\Locale;

use Illuminate\Foundation\Http\FormRequest;

class CityRequest extends FormRequest
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
                    'estado' => 'required|integer',
                    'nome' => 'required|string',
                    'shortName' => 'sometimes|nullable|string',
                    'statusId' => 'required|integer',
                    'polygon' => 'sometimes|string|nullable'
                ];
            }
            case 'PUT':
            case 'PATCH':
            {
                return [
                    'estado' => 'sometimes|integer',
                    'nome' => 'sometimes|string',
                    'shortName' => 'sometimes|nullable|string',
                    'statusId' => 'sometimes|integer'
                ];
            }
            default:
                break;
        }
    }
}
