<?php

namespace App\Http\Requests\User\Doc;

use Illuminate\Foundation\Http\FormRequest;

class DocUserImageRequest extends FormRequest
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
            'image' => 'required|file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
        ];
    }

    public function attributes()
    {
        return [
            'image' => 'Imagem'
        ];
    }
}
