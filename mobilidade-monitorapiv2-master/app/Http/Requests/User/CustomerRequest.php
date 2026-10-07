<?php


namespace App\Http\Requests\User;


use App\Models\User\Customer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => [
                'sometimes',
                'nullable',
                'email',
            ],
            'name' => 'sometimes|nullable|string',
            'phone' => [
                'sometimes',
                'nullable',
                'string',
            ],
            'document' => [
                'sometimes',
                'nullable',
                'string',
            ],
            'gender' => 'sometimes|nullable|string',
            'password' => 'sometimes|nullable|string',
            'dateOfBirth' => 'sometimes|nullable|string'
        ];
    }
}
