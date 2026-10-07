<?php

namespace App\Http\Requests\Trip;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TripTypeRequest extends FormRequest
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
            'type' => [
                'required',
                'string',
                Rule::unique('tripType', 'type')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->ignore($this['tripType'] ?? null)
            ],
            'picture' => 'sometimes|file',
            'description' => 'required|string',
            'showType' => 'sometimes|boolean',
            'returnOption' => 'sometimes|boolean',
            'deliveryOption' => 'sometimes|boolean',
            'freightOption' => 'sometimes|boolean',
            'onlyCentral' => 'sometimes|boolean',
            'totemOption' => 'sometimes|boolean',
            'offerOption' => 'sometimes|boolean',
            'serviceOption' => 'sometimes|boolean',
            'openPrice' => 'sometimes|boolean',
            'gender_id' => 'sometimes|integer|exists:gender,id',
            'messageNoDriversFound' => 'required|string',
            'loopingOption' => 'sometimes|boolean',
            'scheduledOnlyOption' => 'sometimes|boolean',
            'idsAppPartners' => 'nullable|array',
            'idsAppPartners.*' => 'integer',
            'idsCallGroups' => 'nullable|array',
            'idsCallGroups.*' => 'integer',
        ];
    }

    public function attributes()
    {
        return [
            'onlyCentral' => 'apenas central',
            'openPrice' => 'preço livre',
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
}
