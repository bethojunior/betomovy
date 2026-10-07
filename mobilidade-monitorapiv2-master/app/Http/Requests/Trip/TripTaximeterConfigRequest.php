<?php

namespace App\Http\Requests\Trip;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TripTaximeterConfigRequest extends FormRequest
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
        return [
            'cityId' => [
                'required',
                Rule::unique('tripTaximeterConfig', 'cityId')
                    ->whereNull('deleted_at')
                    ->ignore($this['id'])
            ],
            'enableCancelButton' => 'required|boolean'
        ];
    }

    public function attributes()
    {
        return [
            'enableCancelButton' => 'habilita botão de cancelar viagem'
        ];
    }
}
