<?php


namespace App\Http\Requests\Company;


use Illuminate\Foundation\Http\FormRequest;

class CompanyDeliveryConfigCallForAllRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'callForAll' => 'required|integer',
            'companyId' => 'required|integer'
        ];
    }
}
