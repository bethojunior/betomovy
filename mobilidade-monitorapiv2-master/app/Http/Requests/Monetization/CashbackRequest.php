<?php

namespace App\Http\Requests\Monetization;

use App\Constants\StatusConst;
use App\Rules\ValueTypeRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CashbackRequest extends FormRequest
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
            'valueType' => [
                'required',
                new ValueTypeRule,
            ],
            'tripTypeId' => [
                'required',
                'integer',
                Rule::unique('cashback', 'tripTypeId')
                    ->where('cityId', $this->cityId)
                    ->where('statusId', StatusConst::ACTIVE)
                    ->ignore($this->id)
            ],
            'cityId' => [
                'required',
                'integer',
                Rule::unique('cashback', 'cityId')
                    ->where('tripTypeId', $this->tripTypeId)
                    ->where('statusId', StatusConst::ACTIVE)
                    ->ignore($this->id)
            ],
            'addToFinalPrice' => 'sometimes|boolean',
            'backToTripBalance' => 'sometimes|boolean',
            'active' => 'sometimes|boolean',
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
            'tripTypeId' => 'tipo de viagem',
            'cityId' => 'cidade',
            'value' => 'valor',
            'valueType' => 'tipo de valor',
        ];
    }
}
