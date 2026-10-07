<?php

namespace App\Http\Requests\Route;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RouteUpdateRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                Rule::unique('route', 'name')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->ignore($this->id)
            ],
            'defaultLayout' => 'required|string',
            'tripTypeId' => 'required|integer|exists:tripType,idTripType',
            'price' => 'required|numeric',
//            'priceId' => 'required|integer|exists:price,id',
            'estimatedTime' => 'required|numeric',
            'estimatedDistance' => 'required|numeric',
            'allowCustomerStops' => 'required|boolean',
            'picture' => 'sometimes|nullable|file',
            'origin.tag' => 'sometimes|string',
            'origin.complement' => 'sometimes|string',
            'origin.latitude' => 'required|numeric',
            'origin.longitude' => 'required|numeric',
            'origin.address' => 'required|string',
            'destination.tag' => 'sometimes|string',
            'destination.complement' => 'sometimes|string',
            'destination.latitude' => 'required|numeric',
            'destination.longitude' => 'required|numeric',
            'destination.address' => 'required|string',
            'routeWayPoints' => 'sometimes|array',
            'routeWayPoints.*.routePitStopTypeId' => 'required|integer',
            'routeWayPoints.*.routePitStopId' => 'sometimes|integer',
            'routeWayPoints.*.routePitStop.tag' => 'required_without:routeWayPoints.*.routePitStopId|string',
            'routeWayPoints.*.routePitStop.complement' => 'sometimes|string',
            'routeWayPoints.*.routePitStop.latitude' => 'required_without:routeWayPoints.*.routePitStopId|numeric',
            'routeWayPoints.*.routePitStop.longitude' => 'required_without:routeWayPoints.*.routePitStopId|numeric',
            'routeWayPoints.*.routePitStop.address' => 'required_without:routeWayPoints.*.routePitStopId|string',
            'routeTripItemType' => 'sometimes|array',
            'routeTripItemType.*.tripItemTypeId' => 'integer|distinct',
            'routeTripItemType.*.value' => 'numeric',
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'Nome da rota',
            'routeTripItemType.*.tripItemTypeId' => 'Tipo de item',
            'routeWayPoints.0.routePitStop.tag' => 'Nome da parada',
            'routeWayPoints.0.routePitStop.latitude' => 'Latitude da parada',
            'routeWayPoints.0.routePitStop.longitude' => 'Longitude da parada',
            'routeWayPoints.0.routePitStop.address' => 'Endereço da parada',
            'routeWayPoints.0.routePitStopId' => 'Parada'
        ];
    }
}
