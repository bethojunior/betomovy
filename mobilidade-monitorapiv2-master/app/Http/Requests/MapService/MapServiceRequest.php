<?php


namespace App\Http\Requests\MapService;


use Illuminate\Foundation\Http\FormRequest;

class MapServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        switch ($this->method()) {
            case 'POST':
            {
                return [
                    'mapServiceId' => 'required|integer',
                    'metadata.*.key' => 'required|string',
                    'metadata.*.value' => 'required|string',
                ];
            }
            default:
                return [];
        }
    }
}
