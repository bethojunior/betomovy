<?php

namespace App\Http\Requests\Notification;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReadAdminNotificationRequest extends FormRequest
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
            'id' => [
                Rule::exists('adminNotification', 'id')
                    ->where('read', 0)
            ]
        ];
    }

    public function all($keys = null)
    {
        $params = $this->route()->parameters();

        $params += ['id' => ($params['adminNotification']->id ?? null)];

        return array_replace_recursive(
            parent::all(),
            $params
        );
    }

    public function messages()
    {
        return ['id.exists' => 'Essa notificação já está marcada como lida'];
    }
}
