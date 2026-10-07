<?php

namespace App\Http\Requests\Trip;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewTripRequest extends FormRequest
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
            'cityId' => 'required|integer',
            'tripTypeId' => 'required|integer',
            'tripPaymentFormId' => 'required|integer',
            'priceId' => 'required|integer',
            'centralId' => 'bail|required|integer',
            'price' => 'required|numeric',
            'origin.address' => 'required|string',
            'origin.latitude' => 'required|numeric',
            'origin.longitude' => 'required|numeric',
            'origin.neighborhood' => 'required|string',
            'origin.cityId' => 'sometimes|required|integer',
            'destination.address' => 'required|string',
            'destination.latitude' => 'required|numeric',
            'destination.longitude' => 'required|numeric',
            'destination.neighborhood' => 'required|string',
            'destination.cityId' => 'sometimes|required|integer',
            'tripCustomer.id' => 'sometimes|required|integer',
            'tripCustomer.name' => Rule::requiredIf(function () {
                return !isset($this->request->get('tripCustomer')['id']);
            }),
            'tripCustomer.phone' => [
                Rule::requiredIf(function () {
                    return !isset($this->request->get('tripCustomer')['id']);
                }),
                'bail',
                Rule::unique('centralCustomer','phone')
                    ->where(function ($query){
                        $query
                            ->where('centralId', $this['centralId']);
                    })
            ],
            'tripCustomer.document' => [
                'sometimes',
                'bail',
                Rule::unique('centralCustomer', 'document')
                    ->where(function ($query){
                        $query
                            ->where('centralId', $this['centralId']);
                    })
            ],
            'tripCustomer.dateOfBirth' => [
                'sometimes',
                'date',
            ],
            'waypoints' => 'sometimes|array',
            'waypoints.*.address' => 'required|string',
            'waypoints.*.latitude' => 'required|numeric',
            'waypoints.*.longitude' => 'required|numeric',
            'waypoints.*.neighborhood' => 'required|string',
            'waypoints.*.cityId' => 'sometimes|required|integer',
        ];
    }

    public function validationData()
    {
        $data = $this->all();

        if (isset($data['tripCustomer']['document']))
            $data['tripCustomer']['document'] = onlyCharacters($data['tripCustomer']['document']);

        if (isset($data['tripCustomer']['phone']))
            $data['tripCustomer']['phone'] = onlyCharacters($data['tripCustomer']['phone']);

        return $data;
    }
}
