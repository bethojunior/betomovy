<?php


namespace App\Http\Requests\Route;


use Illuminate\Foundation\Http\FormRequest;

class CorporateRouteCustomerRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string',
            'document' => 'required|string',
            'address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'companyId' => 'required|integer',
            'phone' => 'required|string',
        ];
    }

}
