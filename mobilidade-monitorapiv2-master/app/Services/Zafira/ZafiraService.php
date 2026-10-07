<?php

declare(strict_types=1);

namespace App\Services\Zafira;

use App\Contracts\Exception\CustomException;
use App\Models\User\User;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\ResponseInterface;

class ZafiraService
{
    private const TIMEOUT_SECONDS = 30;
    private const ENDPOINT_PATH = '/validar-dados';
    private const CPF_INVALID_USER_MESSAGE = 'O CPF informado é inválido. Confira os 11 dígitos e tente novamente.';

    /** @var ZafiraWhatsAppNotificationService */
    private $whatsAppNotificationService;

    public function __construct(ZafiraWhatsAppNotificationService $whatsAppNotificationService)
    {
        $this->whatsAppNotificationService = $whatsAppNotificationService;
    }

    private static function parseZafiraErrorFromJsonBody(string $body): ?string
    {
        if ($body === '') {
            return null;
        }
        try {
            $decoded = json_decode($body, true);
            if (!is_array($decoded)) {
                return null;
            }
            if (isset($decoded['detail']) && is_string($decoded['detail']) && $decoded['detail'] !== '') {
                return $decoded['detail'];
            }
            if (isset($decoded['message']) && is_string($decoded['message']) && $decoded['message'] !== '') {
                return $decoded['message'];
            }
        } catch (\Throwable $ignored) {
            return null;
        }

        return null;
    }

    private static function mapFriendlyErrorMessage(?string $message): ?string
    {
        if ($message === null || trim($message) === '') {
            return null;
        }
        $message = trim((string) preg_replace('/\s*\(ERR_COD\s*\d+\)/i', '', $message));
        if ($message === '') {
            return null;
        }
        if (preg_match('/cpf\s+inv[aá]lido/iu', $message) === 1) {
            return self::CPF_INVALID_USER_MESSAGE;
        }

        return $message;
    }

    private static function extractZafiraResponseErrorMessage(?ResponseInterface $response): ?string
    {
        if ($response === null) {
            return null;
        }
        try {
            return self::parseZafiraErrorFromJsonBody((string) $response->getBody());
        } catch (\Throwable $ignored) {
            return null;
        }
    }

    public function validate(ZafiraValidateRequest $request): array
    {
        $baseUrl = rtrim(config('services.zafira.url', ''), '/');
        if ($baseUrl === '') {
            throw new \RuntimeException('ZAFIRA_GUARDIAN_API_URL não configurado. Defina no .env.');
        }

        $url = $baseUrl . self::ENDPOINT_PATH;
        $payload = $request->toArray();
        $verifySsl = filter_var(config('services.zafira.verify_ssl', true), FILTER_VALIDATE_BOOLEAN);

        try {
            $clientRequest = new Client([
                'timeout' => self::TIMEOUT_SECONDS,
                'verify' => $verifySsl,
                'http_errors' => false,
            ]);
            $response = $clientRequest->post($url, [
                'json' => $payload,
                'headers' => [
                    'Content-Type' => 'application/json',
                    'User-Agent' => 'mobilidade-monitorapiv2/1.0',
                ],
            ]);

            $statusCode = $response->getStatusCode();
            $body = $response->getBody()->getContents();

            if ($statusCode < 200 || $statusCode >= 300) {
                if ($statusCode === 500) {
                    return [
                        'match' => false,
                        'success' => false,
                        'error' => 'A API Zafira não conseguiu processar os dados informados. Verifique se o CPF, nome, telefone e e-mail estão corretos.',
                    ];
                }
                $parsed = self::parseZafiraErrorFromJsonBody($body);
                if ($parsed !== null) {
                    return [
                        'match' => false,
                        'success' => false,
                        'error' => self::mapFriendlyErrorMessage($parsed),
                    ];
                }

                return [
                    'match' => false,
                    'success' => false,
                    'error' => 'API Zafira retornou ' . $statusCode . ': ' . (strlen($body) > 200 ? substr($body, 0, 200) . '...' : $body),
                ];
            }

            $data = json_decode($body, true);
            if (!is_array($data)) {
                return ['match' => false, 'success' => false, 'error' => 'Resposta da API Zafira não é JSON válido.'];
            }

            $validation = isset($data['validation']) && is_array($data['validation'])
                ? $data['validation']
                : [];
            $cpfMatch = isset($validation['cpf']) && (string) $validation['cpf'] === 'match';
            $nomeMatch = isset($validation['nome']) && (string) $validation['nome'] === 'match';

            return [
                'match' => $cpfMatch && $nomeMatch,
                'success' => true,
                'error' => null,
            ];
        } catch (RequestException $e) {
            $response = $e->getResponse();
            $statusCode = $response !== null ? $response->getStatusCode() : 0;
            $zafiraMessage = self::extractZafiraResponseErrorMessage($response);
            if ($zafiraMessage !== null) {
                return [
                    'match' => false,
                    'success' => false,
                    'error' => self::mapFriendlyErrorMessage($zafiraMessage),
                ];
            }
            if ($statusCode === 500) {
                return [
                    'match' => false,
                    'success' => false,
                    'error' => 'A API Zafira não conseguiu processar os dados informados. Verifique se o CPF, nome, telefone e e-mail estão corretos e válidos.',
                ];
            }

            return [
                'match' => false,
                'success' => false,
                'error' => self::mapFriendlyErrorMessage('Erro ao comunicar com a API Zafira: ' . $e->getMessage()),
            ];
        } catch (\Throwable $e) {
            return [
                'match' => false,
                'success' => false,
                'error' => self::mapFriendlyErrorMessage('Erro ao comunicar com a API Zafira: ' . $e->getMessage()),
            ];
        }
    }

    public function validateAndPersist(int $userId, ZafiraValidateRequest $request, string $recipientType = 'customer'): array
    {
        $result = $this->validate($request);
        if (!$result['success']) {
            throw new CustomException($result['error'] ?? 'Erro ao validar na API Zafira.');
        }

        $user = User::findOrFail($userId);
        $user->zafiraValidated = $result['match'] ? 1 : 0;
        $user->save();

        $whatsappSent = false;
        if ($result['match']) {
            $whatsappSent = $this->whatsAppNotificationService->notifyValidatedUser($user, $recipientType);
            return [
                'validated' => true,
                'zafiraValidated' => 1,
                'whatsappSent' => $whatsappSent,
                'message' => 'Dados validados com sucesso (CPF e nome conferem).',
            ];
        }

        return [
            'validated' => true,
            'zafiraValidated' => 0,
            'whatsappSent' => false,
            'message' => 'Dados não conferem com a Receita Federal.',
        ];
    }
}
