<?php

namespace App\Http\Requests\User\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminRequest extends FormRequest
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
        $rules = [
            'email'    => 'required|email',
            'name'     => 'required|string',
            'nickname' => 'required|string',
            'document' => 'required|string',
            'phone'    => 'required|string',
            'roleId'   => 'nullable|integer',
        ];

        if ($this->isMethod('post')) {
            $rules['password'] = 'required|string';
            $rules['confirmationPassword'] = 'required|string';
        } else {
            $rules['password'] = 'nullable|string';
            $rules['confirmationPassword'] = 'nullable|string';
        }

        return $rules;
    }
}
