<?php


namespace Api\Http\Requests\Company;


use Illuminate\Foundation\Http\FormRequest;

class CompanyDeliveryAreaRequest extends FormRequest
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
            'polygon' => 'required|array',
            'polygon.*.lat' => 'required|numeric',
            'polygon.*.lng' => 'required|numeric'
        ];
    }
}
