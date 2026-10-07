<?php

namespace App\Http\Requests\WebhookServices;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusWebhookRequest extends FormRequest
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
            'type_service_id' => 'integer|required'
        ];
    }

    public function attributes()
    {
        return [
            'type_service_id' => 'tipo de serviço'
        ];
    }
}
