<?php


namespace App\Http\Requests\Config;


use Illuminate\Foundation\Http\FormRequest;

class AddressBlacklistRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "address" => "required",
            "latitude" => "required",
            "longitude" => "required"
        ];
    }
}
