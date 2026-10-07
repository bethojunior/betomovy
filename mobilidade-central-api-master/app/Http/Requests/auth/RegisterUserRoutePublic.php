<?php

namespace App\Http\Requests\auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRoutePublic extends FormRequest
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
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255'],
            'phone'       => ['required', 'string', 'max:20'],
            'dateOfBirth' => ['required', 'date', 'before:today'],
            'centralId'   => ['required', 'integer', 'exists:central,id'],
            'image'       => ['sometimes', 'nullable', 'image']
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'        => 'O nome é obrigatório.',
            'email.required'       => 'O email é obrigatório.',
            'email.email'          => 'O email precisa ser válido.',
            'email.unique'         => 'Esse email já está em uso.',
            'phone.required'       => 'O telefone é obrigatório.',
            'phone.unique'         => 'Esse telefone já está em uso.',
            'dateOfBirth.required' => 'A data de nascimento é obrigatória.',
            'dateOfBirth.date'     => 'A data de nascimento deve ser válida.',
            'dateOfBirth.before'   => 'A data de nascimento deve ser anterior a hoje.',
            'centralId.required'   => 'O ID da central é obrigatório.',
            'centralId.exists'     => 'A central informada não existe.',
        ];
    }
}
