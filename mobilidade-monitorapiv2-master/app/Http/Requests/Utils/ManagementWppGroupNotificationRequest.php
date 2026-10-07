<?php


namespace App\Http\Requests\Utils;


use Illuminate\Foundation\Http\FormRequest;

class ManagementWppGroupNotificationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        switch ($this->method()) {
            case 'POST':
                {
                    return [
                        'cityId' => 'nullable|integer|exists:city,id',
                        'tripTypeId' => 'nullable|integer|exists:tripType,idTripType',
                        'group_id' => 'required|string',
                        'group_name' => 'required|string',
                        'reference' => 'required|string',
                        'message' => 'required|string',
                        'status' => 'sometimes|boolean',
                    ];
                }
                break;
            case 'PUT':
            case 'PATCH':
                {
                    return [
                        'cityId' => 'nullable|integer|exists:city,id',
                        'tripTypeId' => 'nullable|integer|exists:tripType,idTripType',
                        'group_id' => 'sometimes|string',
                        'group_name' => 'sometimes|string',
                        'reference' => 'sometimes|string',
                        'message' => 'sometimes|string',
                        'status' => 'sometimes|boolean',
                    ];
                }
                break;
            default:
                return [];
                break;
        }
    }
}
