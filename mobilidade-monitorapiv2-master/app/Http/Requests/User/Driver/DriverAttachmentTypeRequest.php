<?php

namespace App\Http\Requests\User\Driver;

use Illuminate\Foundation\Http\FormRequest;

class DriverAttachmentTypeRequest extends FormRequest
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
            'description' => 'sometimes|nullable|string',
            'picture' => 'sometimes|nullable|image'
        ];
    }
}
