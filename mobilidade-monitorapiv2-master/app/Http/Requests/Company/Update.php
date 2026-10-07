<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class Update extends FormRequest
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
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id'           => 'required',
            'fantasyName'  => 'sometimes|string',
            'name'         => 'sometimes|string',
            'address'      => 'sometimes|string',
            'latitude'     => 'sometimes|numeric',
            'longitude'    => 'sometimes|numeric',
            'billingDay'   => 'sometimes|integer',
            'voucherLimit' => 'sometimes|numeric',
            'site'         => 'sometimes|string',
            'instagram'    => 'sometimes|string',
            'facebook'     => 'sometimes|string',
            'cityId'       => 'sometimes|integer',
            'email'        => 'sometimes|email',
            'phone'        => 'sometimes|string',
            'userId'       => 'sometimes|integer',
            'workers'      => 'sometimes|array'
        ];
    }
}
