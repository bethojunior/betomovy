<?php

namespace App\Http\Requests\CallGroup;

use Illuminate\Foundation\Http\FormRequest;

class LinkedDriverRequest extends FormRequest
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
            'idDriver' => 'required|numeric',
            'idCallGroup' => 'required|numeric',
        ];
    }

    public function attributes()
    {
        return [
            'idDriver' => 'idDriver',
            'idCallGroup' => 'idCallGroup'
        ];
    }
}
