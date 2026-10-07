<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/07/2020
 * Time: 16:34
 */

namespace App\Http\Requests\Driver;


use Illuminate\Foundation\Http\FormRequest;

class DriverFormOfPaymentBlockedRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'tripPaymentForms' => 'nullable|array',
            'tripPaymentForms.*' => 'integer'
        ];
    }

    public function attributes()
    {
        return [
            'tripPaymentForms' => 'formas de pagamento'
        ];
    }
}
