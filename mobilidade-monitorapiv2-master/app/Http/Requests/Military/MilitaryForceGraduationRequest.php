<?php


namespace App\Http\Requests\Military;



use Illuminate\Foundation\Http\FormRequest;

class MilitaryForceGraduationRequest extends FormRequest
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
        switch ($this->method()){
            case 'GET':
            case 'DELETE':
            {
                break;
            }
            case 'POST':
            {
                return [
                    'patent' => 'required|string',
                    'level' => 'required|integer',
                    'militaryForceId' => 'required|integer',
                ];
            }
            case 'PUT':
            case 'PATCH':
            {
                return [
                    'patent' => 'sometimes|string',
                    'level' => 'sometimes|integer',
                    'statusId' => 'sometimes|integer',
                    'militaryForceId' => 'sometimes|integer',
                ];
            }
            default:
                break;
        }
    }
}
