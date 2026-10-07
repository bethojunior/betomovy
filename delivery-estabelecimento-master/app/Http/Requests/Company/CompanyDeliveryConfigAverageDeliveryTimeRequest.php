<?php


namespace App\Http\Requests\Company;


use Illuminate\Foundation\Http\FormRequest;

class CompanyDeliveryConfigAverageDeliveryTimeRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'averageDeliveryTime' => 'required|string',
            'companyId' => 'required|integer'
        ];
    }

}
