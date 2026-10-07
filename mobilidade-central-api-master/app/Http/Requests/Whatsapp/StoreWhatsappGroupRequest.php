<?php

namespace App\Http\Requests\Whatsapp;

use Illuminate\Foundation\Http\FormRequest;

class StoreWhatsappGroupRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'sessionName' => 'required|string|max:255',
            'centralId'   => 'required|string|max:255',
            'groups'      => 'nullable|array',
            'groups.*'    => 'string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'groups.array'   => 'O campo groups deve ser uma lista de grupos.',
            'groups.*.string' => 'Cada grupo deve ser um texto.',
        ];
    }
}
