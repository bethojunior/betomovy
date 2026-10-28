<?php

namespace App\Http\Requests\User\Doc;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DocUserRequest extends FormRequest
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
            'docStatusId' => 'required|integer|exists:docStatus,id',
            'userId' => 'required|integer|exists:user,idUser',
            'docId' => [
                'required',
                'integer',
                Rule::exists('doc', 'id'),
            ],
            'image' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
            'pdf' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:10240',
        ];
    }

    public function attributes()
    {
        return [
            'docId' => 'Documento'
        ];
    }
}
