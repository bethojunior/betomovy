<?php

namespace App\Http\Requests\Freight;

use Illuminate\Foundation\Http\FormRequest;

class ItemRequest extends FormRequest
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
            'description'   => 'required|string|min:3',
            'weight'        => 'required|numeric',
            'height'        => 'required|numeric',
            'width'         => 'required|numeric',
            'depth'         => 'required|numeric',
            'picture'       => 'required|file'
        ];
    }
}
