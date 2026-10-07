<?php

namespace App\Http\Requests\User;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PendencyFieldRequest extends FormRequest
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
            'pendencies' => 'required|array',
            'pendencies.*.userId'
                => 'required|integer|exists:user,idUser',
            'pendencies.*.pendencyFieldTypeId' => [
                'required',
                'integer',
                'exists:pendencyFieldType,id',
            ],
            'pendencies.*.pendencyFieldStatusId'
                => 'required|integer|exists:pendencyFieldStatus,id',
        ];
    }
}
