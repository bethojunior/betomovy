<?php


namespace App\Http\Requests\Delivery;


use Illuminate\Foundation\Http\FormRequest;

class TypeDeliveryCategoryRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required',
            'description' => 'required'
        ];
    }
}
