<?php


namespace App\Http\Requests\Config;


use Illuminate\Foundation\Http\FormRequest;

class SettingDeliveryCompanyPixRequest  extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'merchantName' => 'required|string',
            'merchantCity' => 'required|string',
            'pixKey' => 'required|string',
            'description' => 'required|string',
            'companyId' => 'required|integer',
        ];
    }
}
