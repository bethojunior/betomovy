<?php

namespace app\services\payment\split;

use app\constant\DriverBalanceConst;
use app\constant\DriverSplitConfigConst;
use app\constant\DriverSplitValueConst;
use app\dao\BalanceDao;
use app\dao\BalanceFlowDao;
use app\dao\DriverSplitConfigDao;
use app\dao\DriverSplitValueDao;
use app\dao\TransactionDao;
use app\dtos\checkout\split\SplitPaymentDTO;
use app\exceptions\CheckoutServiceException;
use app\model\Config;
use app\model\Transaction;
use app\model\Trip;
use app\model\TripCardPayment;
use app\services\CheckoutService;
use Exception;

class DriverSplitPaymentService
{
    private DriverSplitValueDao $driverSplitValueDao;
    private DriverSplitConfigDao $driverSplitConfigDao;
    private CheckoutService $checkoutService;
    private ?\stdClass $driverSplitConfig;
    private TransactionDao $transactionDao;
    private BalanceFlowDao $balanceFlowDao;

    public function __construct()
    {
        $this->driverSplitValueDao = new DriverSplitValueDao();
        $this->driverSplitConfigDao = new DriverSplitConfigDao();
        $this->balanceFlowDao = new BalanceFlowDao();
        $this->transactionDao = new TransactionDao();
    }

    /**
     * Função deve ser chamada apenas após a existência dos valores na tabela driverSplitValue
     * e antes da captura do pagamento no cartão de crédito
     * @param Trip $trip
     * @param TripCardPayment $tripCardPayment
     * @return Transaction|null
     * @throws CheckoutServiceException
     * @throws Exception
     */
    public function payDriverIfSplitEnabled(Trip $trip, TripCardPayment $tripCardPayment): ?Transaction
    {
        $validated = $this->validateSplitEnabled($trip->getDriverId());

        if (!$validated) {
            return null;
        }

        $driverSplitValue = $this->driverSplitValueDao->findByTripAndDriver($trip->getIdTrip(), $trip->getDriverId());
        if (!$driverSplitValue) {
            return null;
        };

        // check if split amount is lower than 1% of trip price
        $tripPrice = (int) ($trip->getPrice() * 100); // convert to cents
        $minimumAppCommissionValue = $tripPrice * 0.01; // minimum percentage is 1%
        if ($driverSplitValue->amount < $minimumAppCommissionValue) {
            $this->driverSplitValueDao->updateStatusAndTransaction(
                $driverSplitValue->id,
                DriverSplitValueConst::STATUS_CANCELED,
                null
            );

            return null;
        }

        $oldTransaction = $this->transactionDao->find($tripCardPayment->getTransactionId());

        $this->loadCheckoutService($oldTransaction->intermediaryId);

        $this->cancelOldPayment(new Transaction($oldTransaction));

        $splitPaymentDTO = $this->getSplitPaymentDTO($driverSplitValue->amount);

        $transaction = $this->createNewPaymentWithDriverSplit($tripCardPayment, $splitPaymentDTO);

        $this->driverSplitValueDao->updateStatusAndTransaction(
            $driverSplitValue->id,
            DriverSplitValueConst::STATUS_PAID,
            $transaction->getIdTransaction()
        );

        $this->balanceFlowDao->insert(
            $driverSplitValue->amount / 100, // convert to real
            DriverBalanceConst::BALANCE_OUT_BY_SPLIT_PAYMENT,
            $driverSplitValue->balanceId,
            $trip->getTripReference()
        );

        return $transaction;
    }

    /**
     * @param int $driverId
     * @return bool
     */
    private function validateSplitEnabled(int $driverId): bool
    {
        $generalSplitConfig = (bool) Config::get('enable_driver_split_payment');
        if (!$generalSplitConfig) {
            return false;
        }

        $this->loadDriverSplitConfig($driverId);

        if (!$this->driverSplitConfig) {
            return false;
        }

        if ($this->driverSplitConfig->status !== DriverSplitConfigConst::STATUS_ACTIVE) {
            return false;
        }

        return true;
    }

    private function loadDriverSplitConfig(int $driverId): void
    {
        $this->driverSplitConfig = $this->driverSplitConfigDao->findActiveByDriver($driverId);
    }

    private function loadCheckoutService(int $intermediaryId): void
    {
        $this->checkoutService = new CheckoutService($intermediaryId);
    }

    /**
     * @throws CheckoutServiceException
     */
    private function cancelOldPayment(Transaction $transaction): void
    {
        $this->checkoutService->refundPayment($transaction);
    }

    /**
     * Monta o objeto de pagamento para o motorista
     * Método deve ser acionado após o carregamento da configuração do split do motorista loadDriverSplitConfig()
     * @param float $amount
     * @return SplitPaymentDTO
     */
    private function getSplitPaymentDTO(float $amount): SplitPaymentDTO
    {
        return new SplitPaymentDTO(
            $this->driverSplitConfig->externalId,
            'SECONDARY',
            'AMOUNT',
            false,
            $amount,
        );
    }

    /**
     * @throws CheckoutServiceException
     */
    private function createNewPaymentWithDriverSplit(
        TripCardPayment $tripCardPayment,
        SplitPaymentDTO $splitPaymentDTO
    ): Transaction
    {
        $appTitle = Config::get('app_title');

        return $this->checkoutService
            ->addSplitConfig($splitPaymentDTO)
            ->doCardCreditPayment(
                $tripCardPayment->getAmount(),
                $tripCardPayment->getCardId(),
                $tripCardPayment->getTripReference(),
                'VIAGEM - ' . ($appTitle ?? "") . ' - ' . $tripCardPayment->getTripReference()
            );
    }
}