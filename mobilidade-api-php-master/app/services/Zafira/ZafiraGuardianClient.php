<?php

namespace app\services\Zafira;

use app\constant\ZafiraConst;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class ZafiraGuardianClient
{
    /** @var Client|null */
    private $client;

    /**
     * @param Client|null $client
     */
    public function __construct($client = null)
    {
        $this->client = $client;
    }

    /**
     * @param array{name: string, phone: string, document: string, email: string} $payload
     *
     * @return array{status_code: int, body: array|null}
     *
     * @throws GuzzleException
     * @throws Exception
     */
    public function validateRegistration(array $payload): array
    {
        $url = $this->resolveValidateUrl();
        $client = $this->client ?? new Client([
            'timeout' => ZafiraConst::HTTP_TIMEOUT_SECONDS,
            'verify' => $this->resolveVerifySsl(),
            'http_errors' => false,
        ]);

        $response = $client->post($url, [
            'json' => $payload,
            'headers' => [
                'Content-Type' => 'application/json',
                'User-Agent' => 'mobilidade-api-php/1.0',
            ],
        ]);

        $statusCode = $response->getStatusCode();
        $body = json_decode($response->getBody()->getContents(), true);

        return [
            'status_code' => $statusCode,
            'body' => is_array($body) ? $body : null,
        ];
    }

    /**
     * @throws Exception
     */
    private function resolveValidateUrl(): string
    {
        $baseUrl = env('ZAFIRA_GUARDIAN_API_URL');
        if ($baseUrl === null || trim((string) $baseUrl) === '') {
            throw new Exception('A variável de ambiente ZAFIRA_GUARDIAN_API_URL não está configurada.');
        }

        return rtrim((string) $baseUrl, '/') . ZafiraConst::GUARDIAN_VALIDATE_PATH;
    }

    private function resolveVerifySsl(): bool
    {
        $verifySsl = filter_var(env('ZAFIRA_VERIFY_SSL'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($verifySsl === null) {
            return true;
        }

        return $verifySsl;
    }

    public static function formatCpf(string $document): string
    {
        $cpf = self::normalizeCpfDigits($document);
        if (strlen($cpf) !== 11) {
            return $cpf;
        }

        return substr($cpf, 0, 3) . '.' . substr($cpf, 3, 3) . '.'
            . substr($cpf, 6, 3) . '-' . substr($cpf, 9, 2);
    }

    public static function normalizeCpfDigits(string $document): string
    {
        return preg_replace('/\D/', '', $document);
    }

    public static function buildDocumentTripReference(string $document): string
    {
        return ZafiraConst::DOCUMENT_TRIP_REFERENCE_PREFIX . self::normalizeCpfDigits($document);
    }

    /**
     * @param array|null $body
     *
     * @return array{match: bool, validation: array, api_data: mixed}
     */
    public static function parseValidationResult($body): array
    {
        $validation = is_array($body) ? ($body['validation'] ?? []) : [];
        $cpfMatch = isset($validation['cpf']) && (string) $validation['cpf'] === 'match';
        $nomeMatch = isset($validation['nome']) && (string) $validation['nome'] === 'match';

        return [
            'match' => $cpfMatch && $nomeMatch,
            'validation' => $validation,
            'api_data' => is_array($body) ? ($body['api_data'] ?? null) : null,
        ];
    }
}
