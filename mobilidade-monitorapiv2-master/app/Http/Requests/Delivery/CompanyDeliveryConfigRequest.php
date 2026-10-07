<?php

namespace App\Http\Requests\Delivery;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyDeliveryConfigRequest extends FormRequest
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
            'companyId' => [
                'required',
                'integer',
                Rule::unique('companyDeliveryConfig', 'companyId')
                    ->ignore($this['companyId'], 'companyId')
            ],
            'releaseMenu' => 'required|boolean',
            'releaseDelivery' => 'required|boolean',
            'picture' => 'sometimes|nullable|image',
            'establishmentCollectionManagementId' => 'sometimes|nullable|integer',
        ];
    }

    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }

    public function attributes()
    {
        return [
            'monthlyValue' => 'cobrança mensal',
            'chargeFixedValue' => 'cobrança de valor fixo por pedido',
            'chargePercentageValue' => 'cobrança de porcentagem por pedido',
        ];
    }
}
