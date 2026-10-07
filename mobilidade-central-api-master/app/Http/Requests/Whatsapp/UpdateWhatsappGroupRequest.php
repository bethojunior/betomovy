<?php

namespace App\Http\Requests\Whatsapp;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWhatsappGroupRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'centralId'   => 'sometimes|string',
            'sessionName' => 'sometimes|string',
            'groups'      => 'sometimes|array',
            'groups.*'    => 'string',
        ];
    }

    public function messages()
    {
        return [
            'centralId.string'   => 'centralId precisa ser texto.',
            'sessionName.string' => 'sessionName precisa ser texto.',
            'groups.array'       => 'groups precisa ser um array.',
            'groups.*.string'    => 'Cada grupo deve ser texto.',
        ];
    }
}
