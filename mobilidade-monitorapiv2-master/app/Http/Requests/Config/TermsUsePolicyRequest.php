<?php


namespace App\Http\Requests\Config;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TermsUsePolicyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in('driver', 'customer')],
            'description' => 'required'
        ];
    }
}
