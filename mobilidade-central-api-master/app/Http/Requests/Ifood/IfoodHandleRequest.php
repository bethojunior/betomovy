<?php

namespace App\Http\Requests\Ifood;

use Illuminate\Foundation\Http\FormRequest;

class IfoodHandleRequest extends FormRequest
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
    public function rules()
    {
        return [
            "clientId"   => "sometimes|string",
            "clientSecret" => "sometimes|string",
            "centralId" => "required",
        ];
    }
}
