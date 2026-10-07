<?php


namespace App\Http\Requests\Promotion;


use Illuminate\Foundation\Http\FormRequest;

class VoucherPromotionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        switch ($this->method()){
            case 'POST':
            {
                return [
                    'amount' => 'required|numeric',
                    'value' => 'required|numeric',
                    'percentage' => 'sometimes|nullable|numeric',
                    'cityId' => 'required|integer',
                    'user' => 'required|string'
                ];
            }
            case 'PUT':
            case 'PATCH':
            {
                return [
                    'amount' => 'sometimes|numeric',
                    'value' => 'sometimes|numeric',
                    'percentage' => 'sometimes|nullable|numeric',
                    'cityId' => 'sometimes|integer',
                    'user' => 'required|string'
                ];
            }
            default:
                return [];
                break;
        }
    }
}
