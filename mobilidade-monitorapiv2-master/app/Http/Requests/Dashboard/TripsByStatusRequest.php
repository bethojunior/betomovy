<?php

namespace App\Http\Requests\Dashboard;

use App\Constants\Trip\TripConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TripsByStatusRequest extends FormRequest
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
            'status' => [
                'required',
                'string',
                Rule::in(array_merge(TripConst::STATUSES, ['unattended']))
            ],
            'canceledBy' => [
                'sometimes',
                'nullable',
                'string',
                Rule::in(['customer', 'driver', 'central'])
            ],
            'date' => [
                'sometimes',
                'nullable',
                'date_format:Y-m-d'
            ],
            'dateStart' => [
                'sometimes',
                'nullable',
                'date_format:Y-m-d'
            ],
            'dateEnd' => [
                'sometimes',
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:dateStart'
            ],
            'cityId' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:city,idCity'
            ]
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'status.required' => 'O parâmetro status é obrigatório',
            'status.in' => 'O status deve ser um valor válido',
            'canceledBy.in' => 'O campo canceledBy deve ser: customer, driver ou central',
            'date.date_format' => 'A data deve estar no formato Y-m-d',
            'dateStart.date_format' => 'A data inicial deve estar no formato Y-m-d',
            'dateEnd.date_format' => 'A data final deve estar no formato Y-m-d',
            'dateEnd.after_or_equal' => 'A data final deve ser maior ou igual à data inicial',
            'cityId.integer' => 'O cityId deve ser um número inteiro',
            'cityId.exists' => 'A cidade informada não existe'
        ];
    }
}