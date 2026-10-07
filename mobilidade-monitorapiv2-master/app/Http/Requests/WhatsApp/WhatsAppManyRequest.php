<?php

namespace App\Http\Requests\WhatsApp;

use Illuminate\Foundation\Http\FormRequest;

class WhatsAppManyRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'messages' => ['required', 'array', 'min:1'],
            'messages.*.phone' => ['required', 'string'],
            'messages.*.message' => ['required', 'string'],
        ];
    }

    public function messages()
    {
        return [
            'messages.required' => 'O array de mensagens é obrigatório.',
            'messages.array' => 'O campo messages deve ser um array.',
            'messages.*.phone.required' => 'O telefone é obrigatório em cada mensagem.',
            'messages.*.message.required' => 'A mensagem é obrigatória em cada item.',
        ];
    }
}