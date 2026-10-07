<?php

namespace App\Services\Push;

use App\Models\Config\Config;
use GuzzleHttp\Client;
use GuzzleHttp\Pool;
use GuzzleHttp\Psr7\Request as GuzzleRequest;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\ServiceAccount;

/**
 * Envia mensagens FCM (v1) concorrentemente, sem depender do endpoint de
 * batch legado do Google (https://fcm.googleapis.com/batch), que foi
 * descontinuado e passou a falhar silenciosamente.
 *
 * Cada token é enviado em uma requisição individual ao endpoint padrão
 * (messages:send), disparadas concorrentemente (limite configurável) via
 * GuzzleHttp\Pool. É o mesmo mecanismo de autenticação/projeto usado pelo
 * SDK (Kreait\Firebase\Factory::createMessaging()), só que expondo o envio
 * em lote que o SDK não oferece de forma segura.
 */
class FcmSenderService
{
    private const DEFAULT_CONCURRENCY = 25;

    /**
     * @var Client
     */
    private $apiClient;

    /**
     * @var string
     */
    private $projectId;

    public function __construct()
    {
        $jsonFile = $this->resolveServiceAccount();

        $factory = (new Factory)
            ->withServiceAccount($jsonFile);

        $this->projectId = ServiceAccount::fromValue($jsonFile)->getProjectId();

        $this->apiClient = $factory->createApiClient([
            'base_uri' => 'https://fcm.googleapis.com/v1/projects/' . $this->projectId,
        ]);
    }

    /**
     * Envia a mesma mensagem (notification/data) para todos os tokens informados,
     * concorrentemente, e retorna o resultado individual de cada envio.
     *
     * @param CloudMessage $message
     * @param string[] $tokens
     * @return array<string, array{isSuccess: bool, isFailure: bool, error?: string}>
     */
    public function send(CloudMessage $message, array $tokens, int $concurrency = self::DEFAULT_CONCURRENCY): array
    {
        $baseData = $message->jsonSerialize();
        $url = 'https://fcm.googleapis.com/v1/projects/' . $this->projectId . '/messages:send';
        $results = [];

        $requests = (function () use ($tokens, $baseData, $url) {
            foreach ($tokens as $token) {
                $body = json_encode(['message' => array_merge($baseData, ['token' => $token])]);

                yield $token => new GuzzleRequest('POST', $url, [
                    'Content-Type' => 'application/json; charset=UTF-8',
                ], $body);
            }
        })();

        // Pool::batch() acumula uma segunda cópia de cada resposta internamente (e a
        // descartaríamos); montamos o Pool na mão para manter só o $results abaixo.
        $pool = new Pool($this->apiClient, $requests, [
            'concurrency' => $concurrency,
            'fulfilled' => function ($response, $token) use (&$results) {
                $body = json_decode((string) $response->getBody(), true);
                $success = isset($body['name']);
                $results[$token] = ['isSuccess' => $success, 'isFailure' => !$success];
            },
            'rejected' => function ($reason, $token) use (&$results) {
                $results[$token] = [
                    'isSuccess' => false,
                    'isFailure' => true,
                    'error' => $reason instanceof \Throwable ? $reason->getMessage() : (string) $reason,
                ];
            },
        ]);

        $pool->promise()->wait();

        return $results;
    }

    /**
     * Mesma resolução de credencial já usada pelo SDK de mensageria: arquivo local
     * primeiro (caminho relativo ao app, depois relativo à raiz), com fallback para
     * a configuração dinâmica (chave "google_service_account_json" na tabela config,
     * usada por cada instalação white label).
     *
     * @return string|array
     */
    private function resolveServiceAccount()
    {
        $pushFile = '../credentials/google_service_account.json';

        $jsonFile = file_exists($pushFile) ? $pushFile : 'credentials/google_service_account.json';

        if (!file_exists($jsonFile)) {
            $jsonFile = Config::getConf('google_service_account_json');
        }

        return $jsonFile;
    }
}
