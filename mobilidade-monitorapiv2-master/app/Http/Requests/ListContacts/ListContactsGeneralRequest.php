<?php

namespace App\Http\Requests\ListContacts;

use Illuminate\Foundation\Http\FormRequest;

class ListContactsGeneralRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            '*.id_person'               => 'required|string',
            '*.name_person'             => 'required|string',
            '*.phone_person'            => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            '*.id_person.required'               => 'O campo id_person é obrigatório.',
            '*.name_person.required'             => 'O campo name_person é obrigatório.',
            '*.phone_person.required'            => 'O campo phone_person é obrigatório.',
        ];
    }
}
