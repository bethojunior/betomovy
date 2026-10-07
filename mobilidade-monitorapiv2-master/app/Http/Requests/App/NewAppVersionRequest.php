<?php


namespace App\Http\Requests\App;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewAppVersionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'version'  => [
                'required',
                'string',
                Rule::unique('appVersion', 'version')
                    ->where('appId', $this->appId)
                    ->where('platform', $this->platform),
            ],
            'platform' => 'required|string',
            'link'     => 'required|string',
            'appId'    => 'required|integer|exists:app,idApp',
        ];
    }

    public function messages(): array
    {
        return [
            'version.unique' => 'Esta versão já está cadastrada para este app e plataforma',
        ];
    }
}
