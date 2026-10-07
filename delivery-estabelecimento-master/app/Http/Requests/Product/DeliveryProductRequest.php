<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class DeliveryProductRequest extends FormRequest
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
            'companyId' => 'required|integer|exists:company,id',
            'name' => 'required|string',
            'picture' => 'sometimes|nullable|image',
            'isOpenValue' => 'sometimes',
            'deliveryCategoryId' => 'sometimes|nullable|integer|exists:deliveryCategory,id',
            'description' => 'sometimes|nullable|string',
            'costPrice' => 'sometimes|nullable|numeric',
            'price' => 'required|numeric',
            'preparationTime' => 'required|integer',
            'freeDelivery' => 'sometimes|accepted',
            'active' => 'sometimes|nullable|boolean',
            'complements' => 'sometimes|nullable|array',
            'complements.*.minimumQuantity' => 'sometimes|nullable|integer',
            'complements.*.maximumQuantity' => 'sometimes|nullable|integer',
            'complements.*.required' => 'sometimes|nullable|boolean',
            'complements.*.complements' => 'sometimes|nullable|array',
            'complements.*.complements.*.name' => 'sometimes|string',
            'complements.*.complements.*.description' => 'sometimes|nullable|string',
            'complements.*.complements.*.price' => 'sometimes|nullable|numeric',
            'complements.*.complements.*.active' => 'sometimes|nullable|boolean',
        ];
    }

    public function validationData()
    {
        $data = $this->all();

        if (isset($data['complements']))
            $data['complements'] = json_decode($data['complements']);

        return array_replace_recursive(
            $data,
            $this->route()->parameters()
        );
    }
}
