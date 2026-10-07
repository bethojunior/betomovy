<?php

namespace App\Http\Requests\Config;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateZoneRequest extends FormRequest
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
            'zone_id' => 'required|integer|exists:zone,idZone',
            'radius' => 'required|numeric',
            'cityId' => [
                'required',
                'integer',
                Rule::unique('zone', 'cityId')->where(function ($query){
                    $query
                        ->where('statusId', StatusConst::ACTIVE);
                })
                ->ignore(
                    $this->route()
                        ->parameter('zone_id'), 'idZone')
            ],
            'greaterRadius' => 'required|numeric',
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
