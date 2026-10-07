<?php


namespace Delivery\Http\Requests\User;


use Illuminate\Foundation\Http\FormRequest;

class CustomerAsaasRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'userId' => 'required|integer|exists:user,idUser',
            'cardId' => 'required|integer',
        ];
    }
}
