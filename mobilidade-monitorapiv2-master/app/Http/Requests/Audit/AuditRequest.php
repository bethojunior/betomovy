<?php


namespace App\Http\Requests\Audit;


use Illuminate\Foundation\Http\FormRequest;

class AuditRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string',
            'email' => 'required|string',
            'phone' => 'required|string',
            'message' => 'required|string',
        ];
    }
}
