<?php

namespace App\Http\Requests\Trip;

use App\Constants\Trip\TripConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActiveTripFilterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'flow' => ['nullable', 'string', 'max:50'],
            'customerName' => ['nullable', 'string', 'max:150'],
            'driverName' => ['nullable', 'string', 'max:150'],
            'status' => ['nullable', Rule::in(TripConst::STATUSES)],
        ];
    }
}

