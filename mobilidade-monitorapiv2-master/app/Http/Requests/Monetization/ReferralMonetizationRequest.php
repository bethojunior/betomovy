<?php

namespace App\Http\Requests\Monetization;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReferralMonetizationRequest extends FormRequest
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
            'label' => [
                'required',
                Rule::unique('referralMonetization')
                    ->where(function ($query){
                        $query
                            ->where('statusId', StatusConst::ACTIVE);
                    })
                    ->ignore($this->id, 'id')
            ],
            'indications' => [
                'required',
                'numeric',
                'min:1',
            ],
            'tripTypes' => 'required|array',
            'tripTypes.*.value' => 'required|numeric',
            'tripTypes.*.valueType' => [
                'required',
                Rule::in(['%','$'])
            ],
            'tripTypes.*.backToTripBalance' => [
                'required',
                'boolean'
            ],
            'tripTypes.*.tripTypeId' => [
                'sometimes',
                'nullable',
                'distinct',
                Rule::exists('tripType', 'idTripType')
                    ->where('statusId', StatusConst::ACTIVE)
            ],
        ];
    }

    /**
     * @param null $keys
     * @return array
     */
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
            'indications' => 'indicações',
            'label' => 'classe',
            'value' => 'valor',
            'tripTypes.*.backToTripBalance' => 'bônus como voucher',
            'tripTypes.*.tripTypeId' => 'tipo de viagem',
        ];
    }

    /**
     * @return array
     */
    public function messages()
    {
        return [
            'indications.unique' => 'Essa quantidade de indicações já está sendo utilizada',
            'label.unique' => 'Nome da classe já existe',
        ];
    }
}
