<?php

namespace app\services;

use app\constant\DriverBalanceConst;
use app\constant\FinancialIntermediaryConst;
use app\constant\PaymentFormTypeConst;
use app\constant\RewardTripTypeConst;
use app\constant\TransactionConst;
use app\dao\BalanceFlowDao;
use app\dao\CreditPrepaidPurchaseDao;
use app\dao\DriverBalanceDao;
use app\dao\DriverDao;
use app\dao\RewardCampaignTripDao;
use app\dao\TripCancellationCustomerFeeDao;
use app\dao\TripPixPaymentsDao;
use app\dao\UserDiscountCouponDao;
use app\exceptions\CommissionException;
use app\exceptions\DriverCommissionException;
use app\model\Config;
use app\model\Driver;
use app\model\DriverCommission;
use app\model\PaymentForm;
use app\model\Trip;
use app\model\TripAudit;
use app\model\TripDiscountCoupon;
use app\services\payment\split\SaveDriverSplitValueService;
use app\utils\Headers;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/04/2019
 * Time: 11:13.
 */
class DriverBalanceService
{
    private $driverBalanceDao;
    private $driverCommissionService;
    private $tripCancellationCustomerFeeDao;
    private $rewardCampaignTripDao;
    private $transactionService;
    private $checkoutService;
    private $driverDao;
    private $creditPrepaidPurchaseDao;
    private $tripPixPaymentsDao;
    /**
     * @var float|int
     */
    private $tripCancellationFee = 0;

    public function __construct()
    {
        $this->driverCommissionService = new DriverCommissionService();
        $this->driverBalanceDao = new DriverBalanceDao();
        $this->driverDao = new DriverDao();
        $this->tripCancellationCustomerFeeDao = new TripCancellationCustomerFeeDao();
        $this->rewardCampaignTripDao = new RewardCampaignTripDao();
        $this->transactionService = new TransactionService();
        $this->checkoutService = new CheckoutService();
        $this->driverCommissionService = new DriverCommissionService;
        $this->driverBalanceDao = new DriverBalanceDao;
        $this->tripCancellationCustomerFeeDao = new TripCancellationCustomerFeeDao;
        $this->rewardCampaignTripDao = new RewardCampaignTripDao;
        $this->creditPrepaidPurchaseDao = new CreditPrepaidPurchaseDao;
        $this->tripPixPaymentsDao = new TripPixPaymentsDao();
    }

    /**
     * @throws \Exception
     */
    public function addBalanceOnCustomerTrip(Driver $driver, Trip $trip, int $paymentFormTypeId): array
    {
        $trip->setPrice($this->findValueWithTripDiscountCoupon($trip));
        // essa função manda o saldo da corrida para o motorista
        switch ($paymentFormTypeId) {
            case PaymentFormTypeConst::VOUCHER:
            case PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE:
            case PaymentFormTypeConst::VOUCHER_CENTRAL:
                return $this->splitByVoucherPayment($driver, $trip);
            case PaymentFormTypeConst::CREDIT_CARD:
                return $this->splitByCreditCardPayment($driver, $trip);
            case PaymentFormTypeConst::PIX:
                return $this->splitByMoneyPayment($driver, $trip);
            default:
                return $this->splitByMoneyPayment($driver, $trip);
        }
    }

    public function findValueWithTripDiscountCoupon($trip)
    {
        $value = $trip->getPrice();
        $coupon = $trip->tripDiscountCoupon;

        if($coupon->value == 100 && $coupon->valueType == '%') {
            return $coupon->oldPrice;
        }

        return $value;
    } 

    /**
     * @return array
     *
     * @throws \Exception
     */
    private function splitByMoneyPayment(Driver $driver, Trip $trip)
    {
        $driverBalance = $this->addDriverBalanceMoneyInCarPayment(
            $driver->getBalanceId(),
            $trip
        );

        return [
            'driverBalance' => $driverBalance,
        ];
    }

    /**
     * @throws \Exception
     */
    private function splitByVoucherPayment(Driver $driver, Trip $trip): array
    {
        $driverBalance = $this->addDriverBalancePrePayment($driver->getBalanceId(), $trip, false);

        return [
            'driverBalance' => $driverBalance,
        ];
    }

    /**
     * @throws \Exception
     */
    private function splitByCreditCardPayment(Driver $driver, Trip $trip): array
    {
        $driverBalance = $this->addDriverBalancePrePayment(
            $driver->getBalanceId(),
            $trip,
            true
        );

        return [
            'driverBalance' => $driverBalance,
        ];
    }

    /**
     * @return array|mixed
     *
     * @throws CommissionException
     * @throws DriverCommissionException
     * @throws \Exception
     */
    public function addDriverBalancePrePayment($idBalance, Trip $trip, bool $isCreditCard)
    {
        $flowDao = new BalanceFlowDao();

        $commission = $this->driverCommissionService
            ->find($trip->getDriverCommissionId());

        $commissionValue = $this->driverCommissionService
            ->calculateCommission($commission, $trip, $this->tripCancellationFee);

        if ($this->checkDisabledCommissionByPromotion($trip, $commission)) {
            $commissionValue = 0;
        }

        $hasAppCommission = $commissionValue > 0;

        $value =
            $trip->getPrice() - $commissionValue;

        $valueByPaymentForm =
            $this->driverCommissionService
                ->calculateRatePaymentForm($commission, $trip);

        if ($trip->getTripAuditId() == TripAudit::RELEASED) {
            $valueToSplit = $value - ($valueByPaymentForm ?? 0);

            $entryBalanceType = $isCreditCard
                ? DriverBalanceConst::BALANCE_IN_FOR_CARD
                : DriverBalanceConst::BALANCE_ENTRY_BY_TRIP;

            $flowDao->insert($trip->getPrice(),
                $entryBalanceType, $idBalance, $trip->getTripReference());
            if ($valueByPaymentForm) {
                $flowDao->insert($valueByPaymentForm,
                    DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM,
                    $idBalance,
                    $trip->getTripReference()
                );
            }

            if ($hasAppCommission) {
                $flowDao->insert($commissionValue,
                    DriverBalanceConst::BALANCE_OUT_COMMISSIONS, $idBalance, $trip->getTripReference());
            }

            if ($hasAppCommission && $isCreditCard) {
                $splitEnabled = (new SaveDriverSplitValueService())
                    ->saveOrUpdateIfSplitEnabled($trip, $valueToSplit);

                if ($splitEnabled) {
                    // balance flow will be inserted on DriverSplitPaymentService class after new payment
                    return $this->driverBalanceDao->find($idBalance);
                }
            }

            return $this->driverBalanceDao->add(
                $idBalance,
                $valueToSplit
            );
        }

        $this->driverBalanceDao->add($idBalance,
            $trip->getPrice(),
            'blockedBalance');

        $balance =
            $this->driverBalanceDao
                ->add(
                    $idBalance,
                    $commissionValue + ($valueByPaymentForm ?? 0),
                    'blockedBalanceToPay');

        $flowDao->insert($trip->getPrice(),
            DriverBalanceConst::BALANCE_ENTRY_BY_TRIP_IN_ANALYSIS, $idBalance, $trip->getTripReference());

        if ($valueByPaymentForm) {
            $flowDao->insert($valueByPaymentForm,
                DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM_IN_ANALYSIS,
                $idBalance,
                $trip->getTripReference());
        }

        if ($hasAppCommission) {
            $flowDao->insert($commissionValue,
                DriverBalanceConst::BALANCE_OUT_COMMISSIONS_IN_ANALYSIS,
                $idBalance,
                $trip->getTripReference()
            );
        }

        return $balance;
    }

    /**
     * @return array|mixed
     *
     * @throws \Exception
     */
    public function addDriverBalanceMoneyInCarPayment($idBalance, Trip $trip)
    {
        $commission = $this->driverCommissionService
            ->find($trip->getDriverCommissionId());

        $valueCommission = $this->driverCommissionService
            ->calculateCommission($commission, $trip, $this->tripCancellationFee);

        if ($this->checkDisabledCommissionByPromotion($trip, $commission)) {
            $valueCommission = 0;
        }

        if ($this->checkDriverIsIntoByPeriodPerPaid($trip->getDriverId())) {
            $valueCommission = 0;
        }

        $valueByPaymentForm = $this->driverCommissionService
            ->calculateRatePaymentForm($commission, $trip);

        $tripPixPayment = $this->tripPixPaymentsDao->isTripPaid($trip->getTripReference());

        $this->insertDriverBalanceFlowsMoneyInCarPayment($idBalance, $trip, $tripPixPayment);

        if($tripPixPayment && $tripPixPayment->hasPaid) {
            $balance = $this->driverBalanceDao->find($idBalance);
            $this->driverBalanceDao->updateBalance($idBalance, [
                'amount' => $balance->balance += $trip->getPrice(),
            ]);
        }

        if ($trip->getTripAuditId() == TripAudit::RELEASED) {
            return $this->balanceOnReleasedTripMoneyInCar(
                $idBalance,
                $valueCommission,
                $valueByPaymentForm ?? 0,
                $trip
            );
        }

        return $this->balanceOnAnalysisTripMoneyInCar(
            $idBalance,
            $valueCommission,
            $valueByPaymentForm ?? 0,
            $trip
        );
    }

    /**
     * @return array|mixed
     *
     * @throws \Exception
     */
    private function balanceOnReleasedTripMoneyInCar($idBalance, $valueCommission, $valueByPaymentForm, Trip $trip)
    {
        $flowDao = new BalanceFlowDao();

        $balance = $this->driverBalanceDao->sub(
            $idBalance,
            $valueCommission + $valueByPaymentForm);

        if ($valueCommission > 0) {
            $flowDao->insert($valueCommission,
                DriverBalanceConst::BALANCE_OUT_COMMISSIONS, $idBalance, $trip->getTripReference());
        }

        if ($valueByPaymentForm) {
            $flowDao->insert($valueByPaymentForm,
                DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM, $idBalance, $trip->getTripReference());
        }

        return $balance;
    }

    /**
     * @return array|mixed
     *
     * @throws \Exception
     */
    private function balanceOnAnalysisTripMoneyInCar($idBalance, $valueCommission, $valueByPaymentForm, Trip $trip)
    {
        $flowDao = new BalanceFlowDao();

        $balance = $this->driverBalanceDao->add($idBalance,
            $valueCommission + $valueByPaymentForm,
            'blockedBalanceToPay');

        if ($valueCommission > 0) {
            $flowDao->insert($valueCommission,
                DriverBalanceConst::BALANCE_OUT_COMMISSIONS_IN_ANALYSIS, $idBalance, $trip->getTripReference());
        }

        if ($valueByPaymentForm) {
            $flowDao->insert($valueByPaymentForm,
                DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM_IN_ANALYSIS,
                $idBalance,
                $trip->getTripReference());
        }

        return $balance;
    }

    /**
     * @throws \Exception
     */
    private function insertDriverBalanceFlowsMoneyInCarPayment($idBalance, Trip $trip, $tripPixPayment): void
    {
        $balanceFlowDao = new BalanceFlowDao();

        $typeBalance = $tripPixPayment && $tripPixPayment->hasPaid
            ? DriverBalanceConst::BALANCE_IN_FOR_PIX
            : DriverBalanceConst::BALANCE_ENTRY_BY_TRIP_PAYMENT_IN_CAR;

        $balanceFlowDao
            ->insert(
                $trip->getPrice(),
                $typeBalance,
                $idBalance,
                $trip->getTripReference()
            );


        if($tripPixPayment && $tripPixPayment->hasPaid) {
            return;
        }

        $balanceFlowDao
            ->insert(
                $trip->getPrice(),
                DriverBalanceConst::BALANCE_OUT_BY_TRIP_PAYMENT_IN_CAR,
                $idBalance,
                $trip->getTripReference()
            );
    }

    /**
     * Retorna true se a remoção da comissão promocional estiver habilitada.
     *
     * @return bool
     */
    private function checkDisabledCommissionByPromotion(Trip $trip, DriverCommission $commission)
    {
        if (!((bool) $commission->getDisableOnPromotion())) {
            return false;
        }

        $reward = $this->rewardCampaignTripDao
            ->findByTripAndRewardTripType(
                $trip->getTripReference(),
                RewardTripTypeConst::REWARD_CAMPAIGN_MIN_PRICE);

        if ($reward) {
            return true;
        }

        return false;
    }

    /**
     * @return float|int
     */
    public function getTripCancellationFee()
    {
        return $this->tripCancellationFee;
    }

    /**
     * @param float|int $tripCancellationFee
     */
    public function setTripCancellationFee($tripCancellationFee): DriverBalanceService
    {
        $this->tripCancellationFee = $tripCancellationFee;

        return $this;
    }

    public function findWithAccountInfo($request)
    {
        return $this->driverDao->findWithAccountInfo($request->driverId);
    }

    /**
     * @param $driverId
     * @return bool
     */
    private function checkDriverIsIntoByPeriodPerPaid($driverId): bool
    {
        $findUserByDriverId = $this->driverDao->findSimple($driverId);

        // Verifica se a Config Key está definida como false
        $configKey = (bool)Config::get('enable_pre-paid_commission_charging_per_period');
        if (!$configKey) {
            // Se a Config Key for false, verifica se a função retorna true
            $result = $this->creditPrepaidPurchaseDao->findByUserToByPeriod($findUserByDriverId->userId);

            if ($result) {
                return true;
            }
        }

        return false;
    }

}
