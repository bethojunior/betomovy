<?php


namespace App\Http\Requests\Driver;


use Illuminate\Foundation\Http\FormRequest;

class IconMapDriverRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'icon' => 'required|file'
        ];
    }
}
