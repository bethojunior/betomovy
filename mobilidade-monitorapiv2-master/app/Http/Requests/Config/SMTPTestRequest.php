<?php

namespace App\Http\Requests\Config;

use Illuminate\Foundation\Http\FormRequest;

class SMTPTestRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => 'required|email|string',
        ];
    }

}
