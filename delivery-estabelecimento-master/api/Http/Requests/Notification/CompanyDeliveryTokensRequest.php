<?php


namespace Api\Http\Requests\Notification;


use Illuminate\Foundation\Http\FormRequest;

class CompanyDeliveryTokensRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "token" => "required|string",
            "companyId" => "required|integer"
        ];
    }
}
