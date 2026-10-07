<?php

namespace App\Http\Requests\ConfigListContacts;

use Illuminate\Foundation\Http\FormRequest;

class ConfigListContactsRequest extends FormRequest
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
            'messageContacts' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'messageContacts.string' => 'A mensagem de contato deve ser um texto válido.',
            'messageContacts.max' => 'A mensagem de contato deve ter no máximo 255 caracteres.',
        ];
    }
}
