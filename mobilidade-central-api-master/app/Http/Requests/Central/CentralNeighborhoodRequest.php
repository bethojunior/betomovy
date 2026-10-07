<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;

class CentralNeighborhoodRequest extends FormRequest
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
            'value' => 'required|numeric',
            'neighborhoodId' => 'required|integer|exists:neighborhood,id',
            'tripTypeId' => 'required|integer|exists:tripType,idTripType',
            'centralId' => 'required|integer|exists:central,id'
        ];
    }
}
