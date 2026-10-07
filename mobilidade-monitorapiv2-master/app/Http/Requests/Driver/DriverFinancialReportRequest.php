<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DriverFinancialReportRequest extends FormRequest
{
    public function rules()
    {
        return [
            'startDate' => 'nullable|date|before_or_equal:endDate',
            'endDate' => 'nullable|date|after_or_equal:startDate',
        ];
    }

    public function authorize()
    {
        return true;
    }
}