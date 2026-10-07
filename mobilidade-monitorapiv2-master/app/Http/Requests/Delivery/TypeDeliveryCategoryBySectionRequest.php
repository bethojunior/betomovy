<?php

namespace App\Http\Requests\Delivery;

use Illuminate\Foundation\Http\FormRequest;

class TypeDeliveryCategoryBySectionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'typeDeliveryCategoryId' => 'required|integer',
            'deliverySections' => 'present|array',
        ];
    }
}
