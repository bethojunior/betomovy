<?php

namespace App\Http\Requests\User;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserTypeRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                Rule::unique('userType', 'name')
                    ->where('statusId', StatusConst::ACTIVE)
            ],
            'description' => 'sometimes|nullable|string',
            'isActive' => 'required|boolean',
            'vehicleType' => ['sometimes', 'nullable', 'string', Rule::in(['car', 'bike'])],
            'isDeliveryMan' => 'sometimes|nullable|boolean',
            'picture' => 'required|file',
            'iconMapDriverId' => 'sometimes|integer',
            'acceptedText' => 'sometimes|nullable|string',
            'boardingText' => 'sometimes|nullable|string',
            'inProgressText' => 'sometimes|nullable|string',
            'cancellationText' => 'sometimes|nullable|string',
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'título do tipo de motorista',
            'picture' => 'imagem',
            'description' => 'descrição',
            'isActive' => 'ativo',
        ];
    }
}
