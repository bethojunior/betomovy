<?php

namespace App\Http\Requests\Balance;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WithdrawsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'withdraws' => 'required|array'
        ];
    }

    public function attributes(): array
    {
        return [
            'withdraws' => 'Transferências',
            'idWithdraw' => 'id da transferência',
        ];
    }

    public function messages(): array
    {
        return [
            'withdraws.*.idWithdraw' =>
                'O id transferência está inválido.'
        ];
    }
}
