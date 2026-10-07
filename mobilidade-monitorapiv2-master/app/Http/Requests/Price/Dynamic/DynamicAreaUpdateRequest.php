<?php

namespace App\Http\Requests\Price\Dynamic;

use App\Rules\ValidateScheduleTimeRuleUpdate;
use Illuminate\Foundation\Http\FormRequest;

class DynamicAreaUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'multiplierValue' => 'required|numeric',
            'cityId' => 'required|integer|exists:city,id',
            "startTime" => [
                'bail',
                'required',
                'date_format:H:i:s',
                new ValidateScheduleTimeRuleUpdate($this['cityId'], $this['name'] ?? null, $this->id ?? null)
            ],
            "endTime" => [
                'bail',
                'required',
                'date_format:H:i:s',
                'after:startTime',
                new ValidateScheduleTimeRuleUpdate($this['cityId'], $this['name'] ?? null, $this->id ?? null)
            ],
        ];
    }
}
