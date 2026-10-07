<?php


namespace App\Http\Requests\App;


use Illuminate\Foundation\Http\FormRequest;

class MenuAppRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'description' => 'required|string',
            'link' => 'required|string',
            'phoneNotification' => 'sometimes|string|nullable',
            'menuAppTypeId' => 'required|integer',
            'menuAppTypeAction' => 'sometimes|integer|nullable|numeric',
            'linkImage' => 'sometimes|file|nullable',
            'textImage' => 'sometimes|string|nullable',
            'buttonsActions' => 'sometimes|array|nullable',
            'quantity' => 'required|array|nullable'
        ];
    }
}
