<?php

namespace App\Http\Requests\App;

use Illuminate\Foundation\Http\FormRequest;

class AppConfigRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mainColor' => 'required|string',
            'mainColorText' => 'required|string',
            'secondaryColor' => 'required|string',
            'secondaryColorText' => 'required|string',
            'logo' => 'nullable|file',
            'appId' => 'required|string',
            'name' => 'required|string',
        ];
    }
}
