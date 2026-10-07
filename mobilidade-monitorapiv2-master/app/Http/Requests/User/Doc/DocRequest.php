<?php

namespace App\Http\Requests\User\Doc;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DocRequest extends FormRequest
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
            'id' => [
                'sometimes',
                'numeric',
                Rule::exists('doc', 'id')
            ],
            'label' => 'required|string|min:1',
            'description' => 'sometimes|string',
            'image' => 'required|boolean',
            'link' => 'sometimes|nullable|url',
            'text' => 'required|boolean',
            'pdf' => 'required|boolean',
        ];
    }

    public function attributes()
    {
        return [
            'label' => 'nome do documento',
            'image' => 'imagem',
            'description' => 'descrição',
            'text' => 'texto',
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
