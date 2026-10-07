<?php

namespace App\Http\Requests\Neighborhood;

use Illuminate\Foundation\Http\FormRequest;

class CompanyDeliveryNeighborhoodRequest extends FormRequest
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
            'deliveryNeighborhoodId' => 'required|integer|exists:deliveryNeighborhood,id',
            'price' => 'required|numeric'
        ];
    }

    public function attributes()
    {
        return [
            'price' => 'preço',
            'deliveryNeighborhoodId' => 'bairro'
        ];
    }
}
