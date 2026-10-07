<?php


namespace App\Http\Requests\Company;


use Illuminate\Foundation\Http\FormRequest;

class CompanyDeliveryRateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'companyId' => 'required|integer|exists:company,id',
            'range' => 'required|integer',
            'tax' => 'required|numeric',
            'time' => 'required|integer',
        ];
    }
}
