<?php


namespace App\Http\Requests\Company;


use Illuminate\Foundation\Http\FormRequest;

class CompanyDeliveryManRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => 'required|string',
        ];
    }
}
