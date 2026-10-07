<?php

namespace App\Http\Requests\Config\FormStep;

use Illuminate\Foundation\Http\FormRequest;

class FormStepUserTypeRequest extends FormRequest
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
            'userTypeId' => 'required|integer',
            'formStepId' => 'required|integer'
        ];
    }
}
