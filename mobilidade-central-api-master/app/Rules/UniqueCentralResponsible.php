<?php

namespace App\Rules;

use App\Constants\StatusConst;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\DB;

class UniqueCentralResponsible implements Rule
{
    /**
     * Campo a ser validado (name, email, phone)
     *
     * @var string
     */
    private $field;

    /**
     * Create a new rule instance.
     *
     * @param string $field Campo a ser validado: 'name', 'email' ou 'phone'
     */
    public function __construct(string $field)
    {
        $this->field = $field;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // Verifica se existe usuário ATIVO que é responsável de central
        $exists = DB::table('user')
            ->where('statusId', StatusConst::ACTIVE)
            ->where($this->field, $value)
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('centralUser')
                    ->whereColumn('centralUser.userId', 'user.idUser');
            })
            ->exists();

        return !$exists;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        $fieldName = [
            'name' => 'nome',
            'email' => 'e-mail',
            'phone' => 'telefone'
        ];

        return "O campo {$fieldName[$this->field]} já está sendo utilizado por outra central.";
    }
}
