<?php


namespace App\Http\Requests\Delivery;


use Illuminate\Foundation\Http\FormRequest;

class PayMachineReturnRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'payMachineReturnTypeId' => 'required|integer',
            'value'                  => 'sometimes|nullable|numeric',
            'cityId'                 => 'required|integer',
            'paidByPlatform'         => 'sometimes|nullable|boolean'
        ];
    }
}
