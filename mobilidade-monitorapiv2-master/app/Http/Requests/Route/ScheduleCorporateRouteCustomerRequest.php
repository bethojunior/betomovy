<?php


namespace App\Http\Requests\Route;


use Illuminate\Foundation\Http\FormRequest;

class ScheduleCorporateRouteCustomerRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'scheduleCorporateRouteId' => 'required|integer',
            'corporateRouteCustomerId' => 'required|integer'
        ];
    }

}
