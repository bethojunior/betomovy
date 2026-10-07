<?php


namespace App\Http\Requests\App;


use App\Models\App\AppVersion;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AppVersionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $currentVersion = AppVersion::find($this->route('id'));

        if (!$currentVersion) {
            return;
        }

        $this->merge([
            'version'  => $this->input('version', $currentVersion->version),
            'platform' => $this->input('platform', $currentVersion->platform),
            'appId'    => $this->input('appId', $currentVersion->appId),
        ]);
    }

    public function rules(): array
    {
        return [
            'active'   => 'sometimes|boolean',
            'version'  => [
                'sometimes',
                'string',
                Rule::unique('appVersion', 'version')
                    ->where('appId', $this->input('appId'))
                    ->where('platform', $this->input('platform'))
                    ->ignore($this->route('id')),
            ],
            'platform' => 'sometimes|string',
            'link'     => 'sometimes|string',
            'appId'    => 'sometimes|integer|exists:app,idApp',
        ];
    }

    public function messages(): array
    {
        return [
            'version.unique' => 'Esta versão já está cadastrada para este app e plataforma',
        ];
    }
}
