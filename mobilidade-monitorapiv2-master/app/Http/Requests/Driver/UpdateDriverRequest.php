<?php

namespace App\Http\Requests\Driver;

use App\Constants\StatusConst;
use App\Models\User\Driver;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDriverRequest extends FormRequest
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
            'email' => 'sometimes|email',
            'name' => 'sometimes|string',
            'nickname' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'password' => 'sometimes|string|min:5',
            'document' => 'sometimes|string',
            'prepaid' => 'sometimes|boolean',
            'gender' => 'sometimes|nullable|string',
            'cnh' => 'sometimes|nullable|string',
            'dateOfBirth' => 'sometimes|nullable|date',
            'cityId' => 'sometimes|integer',
        ];
    }
}
