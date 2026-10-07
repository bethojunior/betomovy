<?php

namespace App\Http\Requests\Whatsapp;

use Illuminate\Foundation\Http\FormRequest;

class StoreNotificationWhatsappGroupRequest extends FormRequest
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
            'centralId'   => 'required|string|max:255',
            'send_to_group' => 'sometimes|boolean',
            'send_to_driver' => 'sometimes|boolean',
            'group_reference' => 'sometimes|string',
            'message_send_to_driver' => 'sometimes|string',
            'message_send_to_group' => 'sometimes|string'
        ];
    }
}
