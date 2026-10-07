<?php


namespace App\Http\Requests\Establishment;


use Illuminate\Foundation\Http\FormRequest;

class EstablishmentBillingRequest  extends FormRequest
{
    public function authorize()
    {
        return true;
    }


    public function rules()
    {
        return [
            'companyId' => 'required|integer',
            'value' => 'required|numeric',
            'description' => 'required|string'
        ];
    }
}
