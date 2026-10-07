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
        $rules = [
            //            'cityId' => 'required|integer',
            'tripTypeId' => 'required|integer',
            'tripPaymentFormId' => 'required|integer',
            'priceId' => 'required|integer',
            'centralId' => 'bail|required|integer',
            'price' => 'required|numeric',
            'distance' => 'sometimes|nullable|numeric',
            'estimatedTripTime' => 'sometimes|nullable|numeric',
            'multiplierDynamic' => 'sometimes|nullable|numeric',
            'origin.address' => 'required|string',
            'origin.latitude' => 'required|numeric',
            'origin.longitude' => 'required|numeric',
            'origin.neighborhood' => 'sometimes|nullable|string',
            //            'origin.cityId' => 'sometimes|required|integer',
            'destination.address' => 'required|string',
            'destination.latitude' => 'required|numeric',
            'destination.longitude' => 'required|numeric',
            'destination.neighborhood' => 'sometimes|nullable|string',
            //            'destination.cityId' => 'sometimes|required|integer',
            'tripCustomer.id' => 'sometimes|nullable|integer',
            'tripCustomer.userId' => 'sometimes|nullable|integer',
            'tripCustomer.name' => $this->requiredIfNewCustomerRule(),
            'tripCustomer.phone' => [
                $this->requiredIfNewCustomerRule(),
                'bail',
                //                Rule::unique('centralCustomer','phone')
                //                    ->where(function ($query){
                //                        $query
                //                            ->where('centralId', $this['centralId']);
                //                    })
            ],
            'tripCustomer.document' => [
                'sometimes',
                'bail',
                $this->uniqueCustomerDocumentRule(),
            ],
            'tripCustomer.dateOfBirth' => [
                'sometimes',
                'date',
            ],
            'waypoints' => 'sometimes|array',
            'waypoints.*.address' => 'required|string',
            'waypoints.*.latitude' => 'required|numeric',
            'waypoints.*.longitude' => 'required|numeric',
            'waypoints.*.neighborhood' => 'sometimes|nullable|string',
            //            'waypoints.*.cityId' => 'sometimes|required|integer',
            'deliveryInfo' => 'sometimes|array',
            'haveReturn' => 'sometimes|boolean',
            'paidByCentral' => 'sometimes|boolean',
            'isOpenPriceTrip' => 'sometimes|boolean',
            'centralNeighborhoodId' => 'sometimes|integer',
            //            'deliveryInfo.tripReference' => 'sometimes|array',
            'questions' => 'sometimes|array',
            'questions.*.questionId' => 'required|integer',
            'questions.*.response' => 'required|string',
            'userId' => 'sometimes|nullable|integer',
            'favoriteDrivers' => 'sometimes|array',
            'favoriteDrivers.*' => 'integer',
            'aditionalInfo' => 'sometimes|nullable|string',
            'flow' => 'sometimes|nullable|string',
            'tripItems' => 'sometimes|array',
            'tripItems.*.tripItemTypeId' => 'required_with:tripItems|integer',
            'tripItems.*.title' => 'required_with:tripItems|string',
            'taxes' => 'sometimes|array',
            'taxes.*' => 'integer',
        ];

        return $rules;
    }

    private function requiredIfNewCustomerRule()
    {
        return Rule::requiredIf(function () {
            return !isset($this->request->get('tripCustomer')['id']);
        });
    }

    private function uniqueCustomerDocumentRule()
    {
        return Rule::unique('centralCustomer', 'document')
            ->where(function ($query) {
                $query->where('centralId', $this['centralId']);
            });
    }

    protected function validationData()
    {
        $messages = $this->all();

        if (isset($messages['tripCustomer']['document']))
            $messages['tripCustomer']['document'] = onlyCharacters($messages['tripCustomer']['document']);

        if (isset($messages['tripCustomer']['phone']))
            $messages['tripCustomer']['phone'] = onlyCharacters($messages['tripCustomer']['phone']);

        return $messages;
    }
}
