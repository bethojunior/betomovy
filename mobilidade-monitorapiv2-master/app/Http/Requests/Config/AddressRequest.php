<?php

namespace App\Http\Requests\Config;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddressRequest extends FormRequest
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
            'id' => [
                'sometimes',
                'integer',
                Rule::exists('address', 'id')
                    ->where('manual', true)
                    ->where('statusId', StatusConst::ACTIVE)
            ],
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'address' => [
                'required',
                Rule::unique('address')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->where('manual', true)
                    ->ignore($this->id, 'id')
            ],
            'neighborhood' => 'sometimes|nullable|string'
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
