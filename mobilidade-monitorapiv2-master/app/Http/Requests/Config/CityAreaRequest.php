<?php

namespace App\Http\Requests\Config;

use Illuminate\Foundation\Http\FormRequest;

class CityAreaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'polygon' => 'required|array',
            'polygon.*.lat' => 'required|numeric',
            'polygon.*.lng' => 'required|numeric'
        ];
    }
}
