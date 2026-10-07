<?php

namespace App\Http\Requests\Notification;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NotificationRequest extends FormRequest
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
            'title'   => 'required|string',
            'message' => 'required|string',
            'link'    => 'sometimes',
            'image'   => 'sometimes|file',
//            'user_id' => 'sometimes|integer',
//            'user_type' => [
//                'sometimes',
//                Rule::in(['professor', 'aluno'])
//            ],
            'cityId' => 'sometimes|string',
            'userTypes' => 'sometimes|array',
            'identifyUserInLink' => 'sometimes|nullable|boolean'
        ];
    }
}
