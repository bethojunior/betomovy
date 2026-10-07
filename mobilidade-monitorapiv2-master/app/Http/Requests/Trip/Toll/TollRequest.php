<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/08/2020
 * Time: 15:10
 */

namespace App\Http\Requests\Trip\Toll;


use Illuminate\Foundation\Http\FormRequest;

class TollRequest extends FormRequest
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
            'name' => 'required|string|max:30',
            'address' => 'required|string',
            'value' => 'required|numeric|min:0.01',
            'polygon' => 'required',
            'active' => 'sometimes|nullable|boolean',
            'cityId' => 'required|numeric'
        ];
    }
}
