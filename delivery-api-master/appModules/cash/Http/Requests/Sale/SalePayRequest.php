<?php

namespace Cash\Http\Requests\Sale;

use Illuminate\Foundation\Http\FormRequest;

class SalePayRequest extends FormRequest
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
            'secondaryId' => 'exists:sale,secondaryId',
            'salePaymentFormId' => 'required|integer|exists:salePaymentForm,id',
            'userId' => 'required|integer'
        ];
    }

    /**
     * @param null $keys
     * @return array
     */
    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }
}
