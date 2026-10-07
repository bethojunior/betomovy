<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 18:48
 */

namespace Delivery\Http\Requests\Neighborhood;


use Illuminate\Foundation\Http\FormRequest;

class FindNeighborhoodRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        return [
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ];
    }
}
