<?php

namespace App\Http\Requests\Locale;

use Illuminate\Foundation\Http\FormRequest;

class CountryRequest extends FormRequest
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
                    'name' => 'required|string',
                    'shortName' => 'required|string',
                    'statusId' => 'sometimes|integer'
                ];
            }
            case 'PUT':
            case 'PATCH':
            {
                return [
                    'name' => 'sometimes|string',
                    'shortName' => 'sometimes|string',
                    'statusId' => 'sometimes|integer'
                ];
            }
            default:
                break;
        }
    }
}
