<?php

namespace App\Http\Requests\Config;

use Illuminate\Foundation\Http\FormRequest;

class SMTPServerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'mailer' => 'required|string',
            'fromMailer' => 'required|string',
            'fromName' => 'required|string',
            'host' => 'required|string',
            'port' => 'required|string',
            'username' => 'sometimes|nullable|string',
            'password' => 'sometimes|nullable|string',
            'encryption' => 'sometimes|nullable|string'
        ];
    }

}
