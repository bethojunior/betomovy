<?php

namespace App\Http\Requests\User;

use App\Constants\StatusConst;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserTypeRequest extends FormRequest
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
            'picture' => 'sometimes|file',
            'description' => 'sometimes|nullable|string',
            'vehicleType' => ['sometimes', 'nullable', 'string', Rule::in(['car', 'bike'])],
            'isDeliveryMan' => 'sometimes|nullable|boolean',
            'name' => [
                'required',
                'string',
                Rule::unique('userType', 'name')
                    ->where('statusId', StatusConst::ACTIVE)
                    ->ignore($this->id, 'idUserType')
            ],
            'iconMapDriverId' => 'sometimes|integer',
            'acceptedText' => 'sometimes|nullable|string',
            'boardingText' => 'sometimes|nullable|string',
            'inProgressText' => 'sometimes|nullable|string',
            'cancellationText' => 'sometimes|nullable|string',
            'idsAppPartners' => 'nullable|array',
            'idsAppPartners.*' => 'integer',
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
