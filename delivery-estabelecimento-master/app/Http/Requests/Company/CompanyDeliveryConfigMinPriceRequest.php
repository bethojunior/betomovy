<?php


namespace App\Http\Requests\Company;


use Illuminate\Foundation\Http\FormRequest;

class CompanyDeliveryConfigMinPriceRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'minimumOrderValue' => 'required|string',
            'companyId' => 'required|integer'
        ];
    }

}
