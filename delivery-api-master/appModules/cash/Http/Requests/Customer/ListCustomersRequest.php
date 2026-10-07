<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/07/2020
 * Time: 16:21
 */

namespace Cash\Http\Requests\Customer;


use Illuminate\Foundation\Http\FormRequest;

class ListCustomersRequest extends FormRequest
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
            'list' => 'required|array'
        ];
    }

    public function attributes()
    {
        return [
            'list' => 'lista de contatos'
        ];
    }
}
