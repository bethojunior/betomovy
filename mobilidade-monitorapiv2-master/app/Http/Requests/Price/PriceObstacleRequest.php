<?php

namespace App\Http\Requests\Price;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PriceObstacleRequest extends FormRequest
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
            'valuePerFloor' => 'sometimes|numeric',
            'obstacleOnFloorId' => [
                'required',
                'integer',
                Rule::exists('obstacleOnFloor', 'id')
                    ->where('statusId', StatusConst::ACTIVE)
            ],
        ];
    }
}
