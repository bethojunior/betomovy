<?php

namespace App\Http\Requests\Whatsapp;

use Illuminate\Foundation\Http\FormRequest;

class FindWhatsappGroupRequest extends FormRequest
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
        ];
    }

    public function messages()
    {
        return [
            'centralId.string'   => 'centralId precisa ser texto.',
            'sessionName.string' => 'sessionName precisa ser texto.',
        ];
    }
}
