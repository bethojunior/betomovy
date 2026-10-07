<?php

namespace App\Http\Requests\User\Doc;

use Illuminate\Foundation\Http\FormRequest;

class DocUserTypeRequest extends FormRequest
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
            '*.userTypeId' => 'required|integer',
            '*.docId' => 'required|integer',
        ];
    }
}
