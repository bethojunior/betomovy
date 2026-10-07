<?php

namespace App\Http\Requests\Central;

use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Validator;

class StoreCentralRequest extends FormRequest
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
            'name' => 'required|string',
            'address' => 'sometimes|nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'logo' => 'sometimes|nullable|image',
            'user.name' => 'required|string',
            'user.email' => 'required_with:user.name|email',
            'user.phone' => 'required_with:user.name|string',
            'user.password' => 'required_with_all:user.name,user.email|min:5',
            'app_partner' => 'nullable|string'
        ];
    }

    /**
     * Configure the validator instance.
     * Valida os 3 campos verificando apenas centralUser (otimizado)
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $userData = $this->input('user', []);

            if (empty($userData['name']) || empty($userData['email']) || empty($userData['phone'])) {
                return;
            }

            // Normaliza telefone para comparação (remove caracteres especiais)
            $normalizedPhone = onlyCharacters($userData['phone']);

            $nameExists = DB::table('user')
                ->join('centralUser', 'centralUser.userId', '=', 'user.idUser')
                ->where('user.name', $userData['name'])
                ->exists();

            $emailExists = DB::table('user')
                ->join('centralUser', 'centralUser.userId', '=', 'user.idUser')
                ->whereRaw('LOWER(user.email) = LOWER(?)', [$userData['email']])
                ->exists();

            // Valida telefone (query mais complexa devido à normalização)
            $phoneExists = DB::table('user')
                ->join('centralUser', 'centralUser.userId', '=', 'user.idUser')
                ->whereRaw(
                    "REGEXP_REPLACE(user.phone, '[^0-9]', '') = ?",
                    [$normalizedPhone]
                )
                ->exists();

            // Adiciona erros específicos para cada campo duplicado
            if ($nameExists) {
                $validator->errors()->add('user.name', 'O campo nome já está sendo utilizado por outra central.');
            }
            if ($emailExists) {
                $validator->errors()->add('user.email', 'O campo e-mail já está sendo utilizado por outra central.');
            }
            if ($phoneExists) {
                $validator->errors()->add('user.phone', 'O campo telefone já está sendo utilizado por outra central.');
            }
        });
    }

    public function attributes()
    {
        return [
            'user.name' => 'email',
            'user.email' => 'email',
            'user.password' => 'senha',
            'user.phone' => 'telefone',
        ];
    }
}
