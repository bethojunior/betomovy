<?php

namespace App\Http\Requests\Trip;

use Illuminate\Foundation\Http\FormRequest;

class TripScheduledRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'schedule'    => 'required|date|after:now',
            'scheduleUTC' => 'required|date',
        ];
    }
}