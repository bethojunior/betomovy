<?php

namespace App\Http\Requests\Freight;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
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
            'id'            => 'exists:items,id',
            'description'   => 'sometimes|string|min:3',
            'weight'        => 'sometimes|numeric',
            'height'        => 'sometimes|numeric',
            'width'         => 'sometimes|numeric',
            'depth'         => 'sometimes|numeric',
            'picture'       => 'sometimes|file'
        ];
    }

    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }
}
