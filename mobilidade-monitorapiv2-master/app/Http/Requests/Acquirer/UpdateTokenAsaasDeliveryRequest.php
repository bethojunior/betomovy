<?php


namespace App\Http\Requests\Acquirer;


use Illuminate\Foundation\Http\FormRequest;

class UpdateTokenAsaasDeliveryRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'value' => 'required|string',
        ];
    }
}
