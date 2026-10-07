<?php


namespace App\Http\Requests\Config;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeConfirmationCodeRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'type' => [
                'required',
                Rule::in(['email', 'sms']),
            ],
            'value' => 'required|boolean',
        ];
    }

}
