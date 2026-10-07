<?php


namespace App\Services\Driver;


use App\Constants\Balance\DriverBalanceConst;
use App\Constants\Trip\PaymentFormTypeConst;
use App\Constants\Trip\RewardTripTypeConst;
use App\Constants\Trip\TripAuditConst;
use App\Models\Trip\DriverCommission;
use App\Models\Trip\Trip;
use App\Models\User\Driver;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Trip\RewardCampaignTripRepository;
use App\Repositories\Trip\TripPaymentFormRepository;

class DriverBalanceService
{

    private $tripCancellationFee = 0;
    private $tripPaymentFormRepository;
    private $balanceFlowRepository;
    private $balanceRepository;
    private $driverCommissionService;
    private $rewardCampaignTripRepository;

    public function __construct(
        TripPaymentFormRepository $tripPaymentFormRepository,
        BalanceFlowRepository $balanceFlowRepository,
        BalanceRepository $balanceRepository,
        DriverCommissionService $driverCommissionService,
        RewardCampaignTripRepository $rewardCampaignTripRepository
    )
    {
        $this->tripPaymentFormRepository = $tripPaymentFormRepository;
        $this->balanceFlowRepository = $balanceFlowRepository;
        $this->balanceRepository = $balanceRepository;
        $this->driverCommissionService = $driverCommissionService;
        $this->rewardCampaignTripRepository = $rewardCampaignTripRepository;
    }

    /**
     * @param Driver $driver
     * @param Trip $trip
     * @return array
     * @throws \Exception
     */
    public function addBalanceOnCustomerTrip(Driver $driver, Trip $trip): array
    {
        $tripPaymentForm = $this->tripPaymentFormRepository
            ->find($trip->tripPaymentFormId);

        switch (((int)$tripPaymentForm->paymentFormTypeId)) {
            case PaymentFormTypeConst::VOUCHER:
            case PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE:
                return $this->splitByVoucherPayment($driver, $trip);
            case PaymentFormTypeConst::CREDIT_CARD:
                return $this->splitByCreditCardPayment($driver, $trip);
            default:
                return $this->splitByMoneyPayment($driver, $trip);
        }
    }

    /**
     * @param Driver $driver
     * @param Trip $trip
     * @return array
     * @throws \Exception
     */
    private function splitByVoucherPayment(Driver $driver, Trip $trip)
    {
        $driverBalance = $this->addDriverBalancePrePayment($driver->balanceId, $trip);

        return [
            'driverBalance' => $driverBalance
        ];
    }

    /**
     * @param Driver $driver
     * @param Trip $trip
     * @return array
     * @throws \Exception
     */
    private function splitByCreditCardPayment(Driver $driver, Trip $trip)
    {
        $driverBalance = $this->addDriverBalancePrePayment(
            $driver->balanceId,
            $trip
        );

        return [
            'driverBalance' => $driverBalance,
        ];
    }

    /**
     * @param Driver $driver
     * @param Trip $trip
     * @return array
     */
    private function splitByMoneyPayment(Driver $driver, Trip $trip)
    {
        $driverBalance = $this->addDriverBalanceMoneyInCarPayment(
            $driver->balanceId,
            $trip
        );

        return [
            'driverBalance' => $driverBalance
        ];
    }


    /**
     * @param $idBalance
     * @param Trip $trip
     * @return array|mixed
     * @throws \Exception
     */
    public function addDriverBalancePrePayment($idBalance, Trip $trip)
    {
        $commission = $this->driverCommissionService
            ->find($trip->driverCommissionId);

        $commissionValue = $this->driverCommissionService
            ->calculateCommission($commission, $trip, $this->tripCancellationFee);

        if ($this->checkDisabledCommissionByPromotion($trip, $commission))
            $commissionValue = 0;

        $value =
            $trip->price - $commissionValue;

        $valueByPaymentForm =
            $this->driverCommissionService
                ->calculateRatePaymentForm($commission, $trip);

        if ($trip->tripAuditId == TripAuditConst::RELEASED) {
            $balance = $this->balanceRepository->add(
                $idBalance,
                $value - ($valueByPaymentForm ?? 0));

            $this->balanceFlowRepository->insert($trip->price,
                DriverBalanceConst::BALANCE_ENTRY_BY_TRIP, $idBalance, $trip->tripReference);
            if ($valueByPaymentForm)
                $this->balanceFlowRepository->insert($valueByPaymentForm,
                    DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM, $idBalance, $trip->tripReference);

            if ($commissionValue > 0)
                $this->balanceFlowRepository->insert($commissionValue,
                    DriverBalanceConst::BALANCE_OUT_COMMISSIONS, $idBalance, $trip->tripReference);

            return $balance;
        }

        $this->balanceRepository->add($idBalance,
            $trip->price,
            'blockedBalance');

        $balance =
            $this->balanceRepository
                ->add(
                    $idBalance,
                    $commissionValue + ($valueByPaymentForm ?? 0),
                    'blockedBalanceToPay');

        $this->balanceFlowRepository->insert($trip->price,
            DriverBalanceConst::BALANCE_ENTRY_BY_TRIP_IN_ANALYSIS, $idBalance, $trip->tripReference);

        if ($valueByPaymentForm)
            $this->balanceFlowRepository->insert($valueByPaymentForm,
                DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM_IN_ANALYSIS,
                $idBalance,
                $trip->tripReference);

        if ($commissionValue > 0)
            $this->balanceFlowRepository->insert($commissionValue,
                DriverBalanceConst::BALANCE_OUT_COMMISSIONS_IN_ANALYSIS, $idBalance, $trip->tripReference);

        return $balance;
    }

    /**
     * @param $idBalance
     * @param Trip $trip
     * @return mixed
     * @throws \Exception
     */
    public function addDriverBalanceMoneyInCarPayment($idBalance, Trip $trip)
    {
        $commission = $this->driverCommissionService
            ->find($trip->driverCommissionId);

        $valueCommission = $this->driverCommissionService
            ->calculateCommission($commission, $trip, $this->tripCancellationFee);

        if ($this->checkDisabledCommissionByPromotion($trip, $commission))
            $valueCommission = 0;

        $valueByPaymentForm = $this->driverCommissionService
            ->calculateRatePaymentForm($commission, $trip);

        $this->insertDriverBalanceFlowsMoneyInCarPayment($idBalance, $trip);

        if ($trip->tripAuditId == TripAuditConst::RELEASED)
            return $this->balanceOnReleasedTripMoneyInCar(
                $idBalance,
                $valueCommission,
                ($valueByPaymentForm ?? 0),
                $trip);

        return $this->balanceOnAnalysisTripMoneyInCar(
            $idBalance,
            $valueCommission,
            ($valueByPaymentForm ?? 0),
            $trip);
    }

    private function insertDriverBalanceFlowsMoneyInCarPayment($idBalance, Trip $trip): void
    {

        $this->balanceFlowRepository
            ->insert(
                $trip->price,
                DriverBalanceConst::BALANCE_ENTRY_BY_TRIP_PAYMENT_IN_CAR,
                $idBalance,
                $trip->tripReference
            );

        $this->balanceFlowRepository
            ->insert(
                $trip->price,
                DriverBalanceConst::BALANCE_OUT_BY_TRIP_PAYMENT_IN_CAR,
                $idBalance,
                $trip->tripReference
            );
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

    private function checkDisabledCommissionByPromotion(Trip $trip, $commission)
    {
        if (!((boolean)$commission->disableOnPromotion))
            return false;

        $reward = $this->rewardCampaignTripRepository
            ->findByTripAndRewardTripType(
                $trip->tripReference,
                RewardTripTypeConst::REWARD_CAMPAIGN_MIN_PRICE);

        if ($reward)
            return true;

        return false;
    }

    private function balanceOnReleasedTripMoneyInCar($idBalance, $valueCommission, $valueByPaymentForm, Trip $trip)
    {
        $balance = $this->balanceRepository->sub(
            $idBalance,
            $valueCommission + $valueByPaymentForm);

        if ($valueCommission > 0)
            $this->balanceFlowRepository->insert($valueCommission,
                DriverBalanceConst::BALANCE_OUT_COMMISSIONS, $idBalance, $trip->tripReference);

        if ($valueByPaymentForm)
            $this->balanceFlowRepository->insert($valueByPaymentForm,
                DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM, $idBalance, $trip->tripReference);

        return $balance;
    }

    private function balanceOnAnalysisTripMoneyInCar($idBalance, $valueCommission, $valueByPaymentForm, Trip $trip)
    {
        $balance = $this->balanceRepository->add($idBalance,
            $valueCommission + $valueByPaymentForm,
            'blockedBalanceToPay');

        if ($valueCommission > 0)
            $this->balanceFlowRepository->insert($valueCommission,
                DriverBalanceConst::BALANCE_OUT_COMMISSIONS_IN_ANALYSIS, $idBalance, $trip->tripReference);

        if ($valueByPaymentForm)
            $this->balanceFlowRepository->insert($valueByPaymentForm,
                DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM_IN_ANALYSIS,
                $idBalance,
                $trip->tripReference);

        return $balance;
    }

}
