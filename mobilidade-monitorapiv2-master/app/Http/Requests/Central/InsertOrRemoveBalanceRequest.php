<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;

class InsertOrRemoveBalanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
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
            "centralId" => "required",
            "type" => "required",
            "value"=> "required|numeric"
        ];
    }

    public function attributes()
    {
        return [
            "centralId" => "centralId",
            "type" => "tipo",
            "value"=> "valor"
        ];
    }
}
