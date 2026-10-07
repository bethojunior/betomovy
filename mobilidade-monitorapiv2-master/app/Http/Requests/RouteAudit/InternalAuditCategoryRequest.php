<?php


namespace App\Http\Requests\RouteAudit;


use Illuminate\Foundation\Http\FormRequest;

class InternalAuditCategoryRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        switch ($this->method()) {
            case 'POST':
                return [
                    'name' => 'required|string',
                    'path' => 'required|string',
                    'description' => 'required|string',
                    'content' => 'sometimes|nullable|string',
                ];
                break;
            case 'PUT':
                return [
                    'name' => 'sometimes|string',
                    'path' => 'sometimes|string',
                    'description' => 'sometimes|string',
                    'content' => 'sometimes|nullable|string',
                ];
                break;
            default:
                return [];
                break;
        }
    }
}
