<?php

namespace App\Http\Requests\Central;

use App\Constants\Trip\TripConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TripListRequest extends FormRequest
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
            'driverId' => 'sometimes|nullable|numeric',
            'status' => [
                'sometimes',
                'nullable',
                Rule::in(TripConst::STATUSES)
            ],
            'date' => [
                'bail',
                'sometimes',
                'nullable',
                'array',
                function ($attribute, $value, $fail) {
                    if (count($value) != 2)
                        $fail("O campo {$attribute} deve ter dois itens");
                }
            ],
            'date.*' => 'sometimes|date'
        ];
    }
}
