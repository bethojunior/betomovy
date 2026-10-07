<?php

namespace App\Http\Requests\Config;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Validator;

class ValidateAudioUrlRequest extends FormRequest
{
    /**
     * Campos de áudio que precisam de validação de URL
     */
    private const AUDIO_CONFIG_KEYS = [
        'soundCallTrip',
        'soundCallTripScheduled',
        'soundCallTripInDriver',
        'soundCallTripServices',
        'soundCallAlertSchedule',
        'soundCallOnline',
        'soundCallOffline'
    ];

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [];
    }

    /**
     * Configure the validator instance.
     *
     * @param Validator $validator
     * @return void
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $data = $this->all();

            foreach ($data as $key => $value) {
                // Se não for campo de áudio, pular validação
                if (!self::isAudioConfigKey($key)) {
                    continue;
                }

                // Se campo está vazio/null, permitir (será atribuído null)
                if (blank($value)) {
                    continue;
                }

                // Validar URL usando método público
                if (!self::validateAudioUrl($value)) {
                    $validator->errors()->add(
                        $key,
                        "URL inválida ou não acessível para o campo {$key}"
                    );
                }
            }
        });
    }

    /**
     * Valida se uma URL de áudio é válida e acessível
     * Método público estático para uso no Service
     *
     * @param string $url
     * @return bool
     */
    public static function validateAudioUrl(string $url): bool
    {
        // Validar formato de URL
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }

        // Verificar se a URL tem protocolo HTTP/HTTPS
        $parsedUrl = parse_url($url);
        if (!isset($parsedUrl['scheme']) || !in_array($parsedUrl['scheme'], ['http', 'https'])) {
            return false;
        }

        return self::isUrlAccessible($url);
    }

    /**
     * Verifica se uma chave é um campo de áudio
     * Método público estático para uso no Service
     *
     * @param string $key
     * @return bool
     */
    public static function isAudioConfigKey(string $key): bool
    {
        return in_array($key, self::AUDIO_CONFIG_KEYS);
    }

    /**
     * Verifica se a URL está acessível e o endpoint está online
     *
     * @param string $url
     * @return bool
     */
    private static function isUrlAccessible(string $url): bool
    {
        try {
            $response = Http::timeout(5)->head($url);
            return $response->successful() || $response->redirect();
        } catch (\Exception $e) {
            return false;
        }
    }
}

