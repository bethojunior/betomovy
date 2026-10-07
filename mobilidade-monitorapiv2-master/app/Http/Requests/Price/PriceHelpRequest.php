<?php

namespace App\Http\Requests\Price;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PriceHelpRequest extends FormRequest
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
            'cityId' => 'required|integer|exists:city,id',
            'value' => 'required|numeric',
            'accessibilityHelpId' => [
                'required',
                'integer',
                Rule::exists('accessibilityHelp', 'id')
                    ->where('statusId', StatusConst::ACTIVE)
            ],
            'quantityIcon' => 'required|integer'
        ];
    }
}
