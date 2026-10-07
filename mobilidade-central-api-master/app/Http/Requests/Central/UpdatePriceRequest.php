<?php

namespace App\Http\Requests\Central;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePriceRequest extends FormRequest
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
            'price_id' => 'required|exists:price,id',
            'min_price' => 'required|numeric',
            'base_price' => 'required|numeric',
            'km_price' => 'required|numeric',
            'minute_price' => 'required|numeric',
            'tax_price' => 'required|numeric',
            'another_fee' => 'required|numeric',
            'waypoint_price' => 'required|numeric',
            'centralId' => 'required|integer',
            'tripTypeId' => [
                'required',
                'exists:tripType,idTripType',
                Rule::unique('price')->where(function ($query){
                    $query
                        ->where('tripTypeId', $this->get('tripTypeId'))
                        ->where('centralId', $this->get('centralId'))
                        ->where('statusId', StatusConst::ACTIVE);
                })
                ->ignore(
                    $this->route()
                        ->parameter('price_id'), 'id')
            ],
            'tag' => 'required|string',
            'color' => 'required|string',
        ];
    }

    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }
}
