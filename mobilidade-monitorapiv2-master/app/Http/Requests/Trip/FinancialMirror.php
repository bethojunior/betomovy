<?php

namespace App\Http\Requests\Trip;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Constants\Trip\TripConst;

class FinancialMirror extends FormRequest
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
            'startDate' => 'required|date',
            'endDate' => 'required|date',
            'driverId' => 'sometimes|integer',
            'userId' => 'sometimes|integer',
            'analizy' => 'sometimes|boolean',
            'isToday' => 'sometimes|boolean',
            'status' => ['sometimes', 'string', Rule::in(TripConst::STATUSES)],
        ];
    }
}
