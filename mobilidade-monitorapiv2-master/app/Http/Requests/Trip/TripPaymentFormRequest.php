<?php


namespace App\Http\Requests\Trip;


use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TripPaymentFormRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }


    public function rules()
    {

        return [
            'id' => [
                'sometimes',
                'numeric',
                Rule::exists('tripPaymentForm', 'idTripPaymentForm')
                    ->where('statusId', StatusConst::ACTIVE)
            ],
            'name' => 'required|string',
            'paymentFormTypeId' => 'required|integer',
        ];
    }

    /**
     * @param null $keys
     * @return array
     */
    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }

}
