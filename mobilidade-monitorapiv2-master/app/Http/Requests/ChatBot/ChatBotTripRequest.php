<?php

namespace App\Http\Requests\ChatBot;

use Illuminate\Foundation\Http\FormRequest;

class ChatBotTripRequest extends FormRequest
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
            "chatBotTripTypeId" => "integer|required",
            "message" => "required|string",
        ];
    }
}
