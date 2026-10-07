<?php

namespace App\Http\Requests\Balance;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BalancePostingRequest extends FormRequest
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
            'value' => 'required|numeric',
            'balanceFlowTypeId' => 'required|integer|exists:balanceFlowType,idBalanceFlowType',
            'userTypeId' => 'required|integer|exists:userType,idUserType',
            'billingDay' => [
                'required',
                'integer',
                'max:28',
                Rule::unique('balancePosting')
                    ->where('userTypeId', $this['userTypeId'])
                    ->where('balanceFlowTypeId', $this['balanceFlowTypeId'])
            ],
        ];
    }

    public function attributes()
    {
        return [
            'billingDay' => 'dia de faturamento',
            'balanceFlowTypeId' => 'tipo de faturamento',
            'userTypeId' => 'tipo de usuário',
            'value' => 'valor',
        ];
    }

    public function messages()
    {
        return [
            'billingDay.unique' =>
                'O dia de faturamento já está sendo utilizado com esse tipo de lançamento e categoria.'
        ];
    }
}
