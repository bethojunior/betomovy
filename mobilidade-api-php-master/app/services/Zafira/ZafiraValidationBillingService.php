<?php

namespace app\services\Zafira;

use app\constant\ZafiraConst;
use app\dao\BalanceFlowDao;
use app\dao\BalanceFlowTypeDao;
use app\dao\CityConfigDao;
use app\dao\DriverBalanceDao;
use app\dao\DriverDao;
use Exception;
use stdClass;

class ZafiraValidationBillingService
{
    /** @var CityConfigDao */
    private $cityConfigDao;

    /** @var DriverDao */
    private $driverDao;

    /** @var DriverBalanceDao */
    private $driverBalanceDao;

    /** @var BalanceFlowDao */
    private $balanceFlowDao;

    /** @var BalanceFlowTypeDao */
    private $balanceFlowTypeDao;

    /** @var int|null */
    private $balanceFlowTypeId = null;

    public function __construct(
        $cityConfigDao = null,
        $driverDao = null,
        $driverBalanceDao = null,
        $balanceFlowDao = null,
        $balanceFlowTypeDao = null
    ) {
        $this->cityConfigDao = $cityConfigDao ?? new CityConfigDao();
        $this->driverDao = $driverDao ?? new DriverDao();
        $this->driverBalanceDao = $driverBalanceDao ?? new DriverBalanceDao();
        $this->balanceFlowDao = $balanceFlowDao ?? new BalanceFlowDao();
        $this->balanceFlowTypeDao = $balanceFlowTypeDao ?? new BalanceFlowTypeDao();
    }

    /**
     * @throws Exception
     */
    public function assertFeatureEnabled(int $cityId): stdClass
    {
        $cityConfig = $this->cityConfigDao->getByCity($cityId);
        if (!$cityConfig) {
            throw new Exception('Configuração da cidade não encontrada.');
        }
        if (empty($cityConfig->enableZafiraValidationApp)) {
            throw new Exception('Validação Zafira não está habilitada nesta cidade.');
        }

        return $cityConfig;
    }

    /**
     * @throws Exception
     */
    public function resolveValidationPrice(stdClass $cityConfig): float
    {
        if (isset($cityConfig->zafiraValidationPrice) && (float) $cityConfig->zafiraValidationPrice > 0) {
            return (float) $cityConfig->zafiraValidationPrice;
        }

        return ZafiraConst::DEFAULT_VALIDATION_PRICE;
    }

    /**
     * @throws Exception
     */
    public function resolveDriverContext(int $userId): stdClass
    {
        $driver = $this->driverDao->findByUserId($userId, false, true);
        if (!$driver) {
            throw new Exception('Motorista não encontrado.');
        }

        return $driver;
    }

    /**
     * @throws Exception
     */
    public function assertSufficientBalance(int $userId, float $price): stdClass
    {
        $balance = $this->driverBalanceDao->findByUser($userId);
        if (!$balance || !isset($balance->idBalance)) {
            throw new Exception('Saldo do motorista não encontrado.');
        }

        $currentBalance = (float) $balance->balance;
        if ($currentBalance < $price) {
            throw new Exception(
                'Saldo insuficiente. Você precisa de R$ '
                . number_format($price, 2, ',', '.')
                . ' para validar o cadastro. Saldo atual: R$ '
                . number_format($currentBalance, 2, ',', '.')
            );
        }

        return $balance;
    }

    /**
     * @throws Exception
     */
    public function assertNoRecentCharge(int $balanceId, string $document): void
    {
        $balanceFlowTypeId = $this->resolveBalanceFlowTypeId();
        $documentReference = ZafiraGuardianClient::buildDocumentTripReference($document);
        $recent = $this->balanceFlowDao->findRecentZafiraValidation(
            $balanceId,
            $balanceFlowTypeId,
            ZafiraConst::DEDUP_MINUTES,
            $documentReference
        );
        if ($recent) {
            throw new Exception('Validação já realizada recentemente. Aguarde alguns minutos para validar novamente.');
        }
    }

    /**
     * @throws Exception
     */
    public function chargeOnMatch(int $balanceId, float $price, string $document): void
    {
        $balanceFlowTypeId = $this->resolveBalanceFlowTypeId();
        $documentReference = ZafiraGuardianClient::buildDocumentTripReference($document);
        $this->driverBalanceDao->subWithZafiraValidationBalanceFlow(
            $balanceId,
            $price,
            $balanceFlowTypeId,
            $documentReference
        );
    }

    /**
     * @throws Exception
     */
    private function resolveBalanceFlowTypeId(): int
    {
        if ($this->balanceFlowTypeId === null) {
            $this->balanceFlowTypeId = $this->balanceFlowTypeDao->findIdByName(ZafiraConst::BALANCE_FLOW_TYPE_NAME);
            if ($this->balanceFlowTypeId === null) {
                throw new Exception('Tipo de fluxo de saldo Zafira não configurado.');
            }
        }

        return $this->balanceFlowTypeId;
    }
}
