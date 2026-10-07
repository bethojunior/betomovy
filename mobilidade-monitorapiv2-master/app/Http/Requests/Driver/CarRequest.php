<?php


namespace App\Http\Requests\Driver;


use Illuminate\Foundation\Http\FormRequest;

class CarRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        switch ($this->method()) {
            case 'POST':
                return [
                    'id' => 'required|integer'
                ];
            case 'PUT':
                return [
                    'year' => 'sometimes|nullable|integer',
                    'plate' => 'sometimes|nullable',
                    'model' => 'sometimes|nullable',
                    'color' => 'sometimes|nullable',
                    'brand' => 'sometimes|nullable',
                    'renavam' => 'sometimes|nullable',
                    'seatsNumber' => 'sometimes|nullable|integer',
                ];
            default:
                return [];
        }
    }
}
