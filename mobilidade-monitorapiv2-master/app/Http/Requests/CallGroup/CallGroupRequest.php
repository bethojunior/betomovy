<?php

namespace App\Http\Requests\CallGroup;

use Illuminate\Foundation\Http\FormRequest;

class CallGroupRequest extends FormRequest
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
            'name' => 'required|string',
            'image' => 'file|mimes:jpg,png,jpeg|max:2048',
            'weight' => 'required|numeric',
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'Nome',
            'image' => 'Imagem',
            'weight' => 'Peso',
        ];
    }
}
