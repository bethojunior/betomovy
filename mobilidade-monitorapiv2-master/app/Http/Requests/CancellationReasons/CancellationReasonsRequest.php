<?php

namespace App\Http\Requests\CancellationReasons;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CancellationReasonsRequest extends FormRequest
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
            'id' => [
                'sometimes',
                'integer',
                Rule::exists('cancellationReasons', 'idCancellationReasons')
                    ->where('statusId', StatusConst::ACTIVE)
            ],
            "cancellationReasonsTypeId" => "integer|required",
            "name" => "required|string",
            "reports" => "sometimes|boolean",
            "monetized" => "sometimes|boolean",
        ];
    }
}
