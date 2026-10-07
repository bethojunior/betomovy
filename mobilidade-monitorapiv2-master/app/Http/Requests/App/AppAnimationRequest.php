<?php

namespace App\Http\Requests\App;

use Illuminate\Foundation\Http\FormRequest;

class AppAnimationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'screens' => 'required|array',
            'screens.*.id_app' => 'required|integer',
            'screens.*.type' => 'required|string|in:all,client,driver',
            'screens.*.screen' => 'required|string',
            'screens.*.module_id' => 'required|integer|exists:appModules,id',
            'screens.*.active' => 'required|bool',
        ];
    }
}
