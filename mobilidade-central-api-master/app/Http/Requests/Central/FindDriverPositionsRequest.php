<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FindDriverPositionsRequest extends FormRequest
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
            'status' => [
                'sometimes',
                function($attribute, $value, $fail){
                    $statuses = explode(',', $value);

                    foreach ($statuses as $status){
                        if (!in_array($status, ['corrida', 'disponivel', 'desligado']))
                            $fail('O campo '. $attribute. ' não é válido');
                    }
                }
            ]
        ];
    }
}
