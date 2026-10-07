<?php

namespace App\Http\Requests\Config;

use Illuminate\Foundation\Http\FormRequest;

class CityConfigRequest extends FormRequest
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
        switch ($this->method()) {
            case 'GET':
                return [
                    'lat' => 'required|numeric',
                    'lng' => 'required|numeric',
                ];
            case 'PUT':
            case 'POST':
                return [
                    'kmRemainingToPutDriverPreAvailable' => 'sometimes|numeric',
                    'quantityTripWayPoints' => 'sometimes|integer|min:0',
                    'cancellationCustomerFeeValue' => 'sometimes|integer|min:0',
                    'waitingTimeCustomerCancellationFee' => 'sometimes|integer|nullable',
                    'routePercentageCancellationFee' => 'sometimes|numeric',
                    'daysToBillCancellationFee' => 'sometimes|integer',
                    'securityContactNumber' => 'sometimes|string|nullable',
                    'supportContactNumber' => 'sometimes|string|nullable',
                    'supportEmail' => 'sometimes|email|nullable',
                    'urlFacebook' => 'sometimes|url|nullable',
                    'urlInstagram' => 'sometimes|url|nullable',
                    'enabledDriverFields' => 'sometimes|required',
                    'enabledDriverFields.accept' => 'sometimes|required',
                    'enabledDriverFields.accept.price' => 'required_with:enabledDriverFields.accept|boolean',
                    'enabledDriverFields.accept.origin' => 'required_with:enabledDriverFields.accept|boolean',
                    'enabledDriverFields.accept.reward' => 'required_with:enabledDriverFields.accept|boolean',
                    'enabledDriverFields.accept.favorite' => 'required_with:enabledDriverFields.accept|boolean',
                    'enabledDriverFields.accept.destination' => 'required_with:enabledDriverFields.accept|boolean',
                    'enabledDriverFields.accept.paymentForm' => 'required_with:enabledDriverFields.accept|boolean',
                    'enabledDriverFields.accept.estimatedTime' => 'required_with:enabledDriverFields.accept|boolean',
                    'enabledDriverFields.accept.estimatedDistance' => 'required_with:enabledDriverFields.accept|boolean',
                    'timezone' => 'sometimes|nullable|string',
                ];
            default:
                return [];
        }
    }
}
