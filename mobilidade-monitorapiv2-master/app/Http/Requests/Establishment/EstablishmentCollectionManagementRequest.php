<?php


namespace App\Http\Requests\Establishment;


use Illuminate\Foundation\Http\FormRequest;

class EstablishmentCollectionManagementRequest extends FormRequest
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
                        'label' => 'required|string',
                        'fixedValue' => 'required|numeric',
                        'orderValue' => 'required|numeric',
                        'orderPercentage' => 'required|numeric',
                    ];
                }
                break;
            case 'PUT':
            case 'PATCH':
                {
                    return [
                        'label' => 'sometimes|string',
                        'fixedValue' => 'sometimes|numeric',
                        'orderValue' => 'sometimes|numeric',
                        'orderPercentage' => 'sometimes|numeric',
                    ];
                }
                break;
            default:
                return [];
                break;
        }
    }
}
