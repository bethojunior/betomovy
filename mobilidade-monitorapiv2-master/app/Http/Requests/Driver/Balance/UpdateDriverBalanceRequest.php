<?php

namespace App\Http\Requests\Driver\Balance;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDriverBalanceRequest extends FormRequest
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
            'userTypeId' => 'sometimes|integer|exists:userType,idUserType',
        ];
    }
}
