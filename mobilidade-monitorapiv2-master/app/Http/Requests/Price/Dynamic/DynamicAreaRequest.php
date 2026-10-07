<?php

namespace App\Http\Requests\Price\Dynamic;

use App\Rules\ValidateScheduleTimeRule;
use Illuminate\Foundation\Http\FormRequest;

class DynamicAreaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string',
            'multiplierValue' => 'required|numeric',
            'area' => 'required|array',
            'area.*.lat' => 'required|numeric',
            'area.*.lng' => 'required|numeric',
            'cityId' => 'required|integer|exists:city,id',
            "startTime" => [
                'bail',
                'required',
                'date_format:H:i:s',
                new ValidateScheduleTimeRule($this['cityId'], $this['name'])
            ],
            "endTime" => [
                'bail',
                'required',
                'date_format:H:i:s',
                'after:startTime',
                new ValidateScheduleTimeRule($this['cityId'], $this['name'])
            ],
        ];
    }
}
