<?php

namespace App\Http\Requests\Central;

use App\Constants\Central\CentralConst;
use App\Constants\StatusConst;
use App\Constants\Users\UserTypeConst;
use DB;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CentralRequest extends FormRequest
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
            'name' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'syncCustomers' => 'sometimes|boolean',
            'showAllPrices' => 'sometimes|boolean',
            'enableCustomRadiusCentral' => 'sometimes|boolean',
            'placesSearchRadius' => 'sometimes|nullable|numeric',
            'centralCallDriver' => [
                'sometimes',
                Rule::in(array_keys(CentralConst::CENTRAL_CALLS))
            ],
            'responsibleId' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::unique('central', 'responsibleId')
                    ->where('statusId', StatusConst::ACTIVE)
            ],
            'address' => 'sometimes|nullable|string',
            'logo' => 'sometimes|nullable|image',
            'user.name' => 'sometimes|nullable|string',
            'user.email' => [
                'required_with:user.name',
                'email',
            ],
            'user.phone' => [
                'required_with:user.name',
                'string',
            ],
            'user.password' => 'required_with_all:user.name,user.email|min:5'
        ];
    }

    public function attributes()
    {
        return [
            'user.email' => 'email',
            'user.password' => 'senha',
            'user.phone' => 'telefone',
        ];
    }
}
