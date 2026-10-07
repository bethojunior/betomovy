<?php

namespace App\Http\Requests\Trip\Commission;

use App\Constants\StatusConst;
use App\Constants\Trip\CommissionTypeConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PartnerCommissionRequest extends FormRequest
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
            'tripTypeId' => [
                'required',
                'integer',
                'exists:tripType,idTripType',
                Rule::unique('partnerCommission', 'tripTypeId')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->where('cityId', $this['cityId'])
                    ->ignore($this['partnerCommission'])
            ],
            'cityId' => [
                'required',
                'integer',
                'exists:city,id',
                Rule::unique('partnerCommission', 'cityId')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->where('tripTypeId', $this['tripTypeId'])
                    ->ignore($this['partnerCommission'])
            ],
            'partnerCommissionType' => [
                'required',
                'string',
                Rule::in(CommissionTypeConst::TYPES)
            ],
            'partnerCommissionValue' => 'required|numeric'
        ];
    }

    public function attributes()
    {
        return [
            'partnerCommissionType' => 'tipo de comissão',
            'partnerCommissionValue' => 'valor'
        ];
    }

    public function messages()
    {
        return [
            'tripTypeId.unique' => 'esse tipo de chamado já possui comissão nessa cidade',
            'cityId.unique' => 'essa cidade já possui comissão nesse tipo de chamado',
        ];
    }

    public function all($keys = null)
    {
        return array_merge_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }
}
