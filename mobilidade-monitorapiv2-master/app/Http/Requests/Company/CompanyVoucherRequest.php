<?php

namespace App\Http\Requests\Company;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyVoucherRequest extends FormRequest
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
            'companyId' => [
                'required',
                'integer',
                Rule::exists('company', 'id')
                    ->where('statusId', StatusConst::ACTIVE)
            ],
            'value' => 'required|numeric',
            'action' => [
                'required',
                Rule::in(['increment', 'decrement'])
            ]
        ];
    }

    public function all($keys = null)
    {
        return array_replace_recursive(
            parent::all(),
            $this->route()->parameters()
        );
    }
}
