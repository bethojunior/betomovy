<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;

class CentralDriverRequest extends FormRequest
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
            'centralId' => 'required|integer|exists:central,id',
            'driverId' => [
                'required',
                'integer',
                'exists:driver,idDriver'
            ]
        ];
    }
}
