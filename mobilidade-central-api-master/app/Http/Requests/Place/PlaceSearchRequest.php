<?php

namespace App\Http\Requests\Place;

use Illuminate\Foundation\Http\FormRequest;

class PlaceSearchRequest extends FormRequest
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
            'q' => 'required|string',
            'latlng' => [
                'sometimes',
                'string',
                function($attribute, $value, $fail){
                    $coordinates = explode(',', $value);

                    if (count($coordinates) != 2)
                        $fail("O campo ". $attribute . " está inválido");

                    foreach ($coordinates as $coordinate){
                        if (!is_numeric($coordinate))
                            $fail("O campo ". $attribute . " está inválido");
                    }
                }
            ]
        ];
    }
}
