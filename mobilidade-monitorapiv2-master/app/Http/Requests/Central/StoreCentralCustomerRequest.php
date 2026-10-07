<?php

namespace App\Http\Requests\Central;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCentralCustomerRequest extends FormRequest
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
            'central_id' => 'bail|required|numeric',
            'name' => 'required|string',
            'phone' => [
                'required',
                'bail',
                Rule::unique('centralCustomer','phone')
                    ->where(function ($query){
                        $query
                            ->where('centralId', $this['central_id'])
                            ->where('statusId', StatusConst::ACTIVE);
                    })
            ],
            'document' => [
                'sometimes',
                'bail',
                Rule::unique('centralCustomer', 'document')
                    ->where(function ($query){
                        $query
                            ->where('centralId', $this['central_id'])
                            ->where('statusId', StatusConst::ACTIVE);
                    })
            ],
            'dateOfBirth' => [
                'sometimes',
                'date',
            ],
        ];
    }

    public function validationData()
    {
        $data = $this->all();

        if (isset($data['document']))
            $data['document'] = onlyCharacters($data['document']);

        if (isset($data['phone']))
            $data['phone'] = onlyCharacters($data['phone']);

        return array_replace_recursive(
            $data,
            $this->route()->parameters()
        );
    }
}
