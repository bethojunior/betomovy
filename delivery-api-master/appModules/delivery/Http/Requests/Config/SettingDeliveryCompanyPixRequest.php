<?php


namespace Delivery\Http\Requests\Config;


use Illuminate\Foundation\Http\FormRequest;

class SettingDeliveryCompanyPixRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * @return array
     */
    public function rules()
    {
        return [
            'companyId' => 'required|integer',
            'value' => 'required|numeric',
            'orderId' => 'required|integer',
        ];
    }
}
