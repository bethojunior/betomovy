<?php


namespace App\Http\Requests\Price;


use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PriceDynamicScheduledRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cityId' => [
                'required',
                'integer',
                Rule::exists('cityArea', 'cityId')->where('statusId', StatusConst::ACTIVE)
            ],
            'tripTypeId' => [
                'required',
                'array',
                Rule::exists('tripType', 'idTripType')->where('statusId', StatusConst::ACTIVE)
            ],
            'multiplierValue' => 'required|numeric',
            'tag' => 'sometimes|nullable|string',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after:startDate',
            'startDateUTC' => 'required|date',
            'endDateUTC' => 'required|date|after:startDateUTC',
        ];
    }
}
