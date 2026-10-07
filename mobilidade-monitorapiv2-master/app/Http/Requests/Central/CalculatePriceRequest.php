<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;

class CalculatePriceRequest extends FormRequest
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
            'origin' => [
                'required',
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
            ],
            'destination' => [
                'required',
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
            ],
            'waypoints' => [
                'sometimes',
                'string',
                function($attribute, $value, $fail){
                    $points = explode('|', $value);

                    if (count($points) < 1)
                        $fail("O campo " . $attribute . " está inválido");

                    foreach ($points as $point) {
                        $coordinates = explode(',', $point);

                        if (count($coordinates) != 2)
                            $fail("O campo " . $attribute . " está inválido");

                        foreach ($coordinates as $coordinate) {
                            if (!is_numeric($coordinate))
                                $fail("O campo " . $attribute . " está inválido");
                        }
                    }
                }
            ],
        ];
    }
}
