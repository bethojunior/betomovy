<?php

namespace App\Http\Requests\ConfigAppPartners;

use Illuminate\Foundation\Http\FormRequest;

class ConfigAppPartnersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'key' => 'required|string',
            'name_app' => 'required|string',
            'logo_app' => 'required|file|mimes:jpg,png,jpeg|max:2048',
            'primary_color' => 'required|string',
            'secondary_color' => 'required|string',
            'text_color' => 'required|string',
            'phone_support' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'key.required' => 'O campo KEY é obrigatório.',
            'name_app.required' => 'O campo NOME DO APP é obrigatório.',
            'logo_app.required' => 'O campo LOGO é obrigatório.',
            'logo_app.mimes' => 'O LOGO deve ser um arquivo de imagem (jpg, png ou jpeg).',
            'logo_app.max' => 'O LOGO deve ter no máximo 2MB.',
            'primary_color.required' => 'O campo COR PRIMÁRIA é obrigatório.',
            'secondary_color.required' => 'O campo COR SECUNDÁRIA é obrigatório.',
            'text_color.required' => 'O campo COR DE TEXTO é obrigatório.',
        ];
    }
}
