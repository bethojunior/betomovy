<?php

namespace App\Http\Requests\Trip;

use App\Constants\Trip\TripConst;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateScheduledTripRequest extends FormRequest
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
            'tripReference' => [
                'required',
                Rule::exists('trip', 'tripReference')->where(function (Builder $query) {
                    $query->where('status', TripConst::SCHEDULED);
                })
            ],
            'price' => 'required|numeric',
            'origin.address' => 'required|string',
            'origin.latitude' => 'required|numeric',
            'origin.longitude' => 'required|numeric',
            'origin.neighborhood' => 'sometimes|nullable|string',
            'destination.address' => 'required|string',
            'destination.latitude' => 'required|numeric',
            'destination.longitude' => 'required|numeric',
            'destination.neighborhood' => 'sometimes|nullable|string',
            'waypoints' => 'sometimes|array',
            'waypoints.*.address' => 'required|string',
            'waypoints.*.latitude' => 'required|numeric',
            'waypoints.*.longitude' => 'required|numeric',
            'waypoints.*.neighborhood' => 'sometimes|nullable|string',
            'schedule' => 'required|date|after:now',
            'scheduleUTC' => 'required|date',
            'scope' => 'sometimes|in:this,all',
        ];
    }

    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }
}
