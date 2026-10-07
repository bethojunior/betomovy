<?php

namespace App\Http\Requests\Central;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePriceRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'min_price' => 'required|numeric',
            'base_price' => 'required|numeric',
            'km_price' => 'required|numeric',
            'minute_price' => 'required|numeric',
            'tax_price' => 'required|numeric',
            'tax_price_type' => 'required|string|in:$,%',
            'another_fee' => 'required|numeric',
            'another_fee_type' => 'required|string|in:$,%',
            'waypoint_price' => 'required|numeric',
            'tag' => 'required|string',
            'color' => 'required|string',
            'idealListCommonPrice' => 'required|integer',
            'tripTypeId' => 'required|integer|exists:tripType,idTripType',
            'cityId' => 'required|integer|exists:city,id',
            'tax_price_description' => 'sometimes|nullable|string',
            'another_fee_description' => 'sometimes|nullable|string',
            'long_distance_per_km' => 'sometimes|nullable|numeric',
            'long_distance_value_to_final_price' => 'sometimes|nullable|boolean',
            'long_distance_radius' => 'sometimes|nullable|numeric',
            'disable_after_km' => 'sometimes|nullable|numeric',
            'promotional_price_temp' => 'sometimes|nullable|numeric',
            'reward_driver_min_price' => 'sometimes|nullable|numeric',
            'type_additional_value_after_km' => 'sometimes|nullable|in:$,km',
            'km_to_additional_value' => 'sometimes|nullable|numeric',
            'additional_value_after_km' => 'sometimes|nullable|numeric',
            'long_distance_delivery_price' => 'sometimes|nullable|numeric',
            'centralId' => 'sometimes|nullable|integer',
            'waiting_tolerance_seconds' => 'sometimes|nullable|integer',
            'waiting_extra_fee_per_minute' => 'sometimes|nullable|numeric',
            'waiting_penalty_fee' => 'sometimes|nullable|numeric',
            'percentage_min_offer' => 'sometimes|nullable|numeric|min:0|max:100',
            'percentage_max_offer' => 'sometimes|nullable|numeric|min:0|max:100',
            'percentage_min_trip_partner' => 'sometimes|nullable|numeric|min:0|max:100',
            'percentage_max_trip_partner' => 'sometimes|nullable|numeric|min:0|max:100',
            'order' => 'sometimes|nullable|integer|min:1',
        ];
    }
}
