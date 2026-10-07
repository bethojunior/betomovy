<?php

namespace app\services\Zafira;

use app\constant\ZafiraConst;
use Exception;
use GuzzleHttp\Exception\GuzzleException;

class ZafiraRegistrationValidationService
{
    /** @var ZafiraValidationBillingService */
    private $billingService;

    /** @var ZafiraGuardianClient */
    private $guardianClient;

    public function __construct(
        $billingService = null,
        $guardianClient = null
    ) {
        $this->billingService = $billingService ?? new ZafiraValidationBillingService();
        $this->guardianClient = $guardianClient ?? new ZafiraGuardianClient();
    }

    /**
     * Validação maçaneta: consulta Guardian e cobra saldo apenas em match.
     * Não persiste user.zafiraValidated.
     *
     * @throws Exception
     * @throws GuzzleException
     */
    public function validateForDriver(int $userId, ?int $cityId, object $payload): array
    {
        $this->assertRequiredFields($payload);

        $driver = $this->billingService->resolveDriverContext($userId);
        $resolvedCityId = $cityId ?: (isset($driver->cityId) ? (int) $driver->cityId : null);
        if (!$resolvedCityId) {
            throw new Exception('Cidade não identificada.');
        }

        $cityConfig = $this->billingService->assertFeatureEnabled($resolvedCityId);
        $validationPrice = $this->billingService->resolveValidationPrice($cityConfig);
        $balance = $this->billingService->assertSufficientBalance($userId, $validationPrice);
        $documentReference = (string) $payload->document;
        $this->billingService->assertNoRecentCharge((int) $balance->idBalance, $documentReference);

        $guardianPayload = [
            'name' => trim((string) $payload->name),
            'phone' => trim((string) $payload->phone),
            'document' => ZafiraGuardianClient::formatCpf($documentReference),
            'email' => trim((string) $payload->email),
        ];

        $response = $this->guardianClient->validateRegistration($guardianPayload);
        if ($response['status_code'] < 200 || $response['status_code'] >= 300 || !is_array($response['body'])) {
            $body = is_array($response['body']) ? $response['body'] : [];
            $errorMessage = $body['detail'] ?? $body['message'] ?? $body['error'] ?? ZafiraConst::PUBLIC_ERROR;
            throw new Exception(is_string($errorMessage) ? $errorMessage : ZafiraConst::PUBLIC_ERROR);
        }

        $parsed = ZafiraGuardianClient::parseValidationResult($response['body']);
        if ($parsed['match']) {
            $this->billingService->chargeOnMatch(
                (int) $balance->idBalance,
                $validationPrice,
                $documentReference
            );
        }

        $amountCharged = $parsed['match'] ? $validationPrice : 0.0;

        return [
            'match' => $parsed['match'],
            'success' => true,
            'api_data' => $parsed['api_data'],
            'validation' => $parsed['validation'],
            'amount_charged' => $amountCharged,
            'message' => $parsed['match']
                ? 'Dados validados com sucesso (CPF e nome conferem).'
                : 'Dados não conferem com a Receita Federal.',
        ];
    }

    /**
     * @throws Exception
     */
    private function assertRequiredFields(object $payload): void
    {
        if (
            empty($payload->name)
            || empty($payload->phone)
            || empty($payload->document)
            || empty($payload->email)
        ) {
            throw new Exception('Nome, documento, telefone e e-mail são obrigatórios para validar o cadastro.');
        }
    }

    /**
     * Aceita { stdObject: [ {...} ] } (app legado) ou payload direto.
     *
     * @return object
     */
    public static function resolvePayloadFromRequest(): object
    {
        $raw = json_decode(file_get_contents('php://input'));
        if (!$raw || !is_object($raw)) {
            return (object) [];
        }
        if (isset($raw->stdObject) && is_array($raw->stdObject) && count($raw->stdObject) > 0) {
            $item = $raw->stdObject[0];
            return is_object($item) ? $item : (object) (is_array($item) ? $item : []);
        }
        if (isset($raw->name, $raw->phone, $raw->document, $raw->email)) {
            return $raw;
        }

        return $raw;
    }
}
