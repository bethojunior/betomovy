<?php


namespace App\Services\User;


use App\Constants\Balance\CompanyBalanceConst;
use App\Constants\Balance\CustomerBalanceConst;
use App\Constants\Trip\PaymentFormTypeConst;
use App\Models\Trip\Trip;
use App\Models\User\Driver;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Company\CompanyWorkerRepository;
use App\Repositories\Trip\TripPaymentFormRepository;
use App\Services\Driver\DriverBalanceService;
use App\Services\Trip\TripCancellationFeeBalanceService;

class CustomerSplitTripPaymentService
{
    private $balanceRepository;
    private $balanceFlowRepository;
    private $tripCancellationFeeBalanceService;
    private $tripPaymentFormRepository;
    private $companyWorkerRepository;
    private $driverBalanceService;

    public function __construct(
        BalanceRepository $balanceRepository,
        BalanceFlowRepository $balanceFlowRepository,
        TripCancellationFeeBalanceService $tripCancellationFeeBalanceService,
        TripPaymentFormRepository $tripPaymentFormRepository,
        CompanyWorkerRepository $companyWorkerRepository,
        DriverBalanceService $driverBalanceService
    )
    {
        $this->balanceRepository = $balanceRepository;
        $this->balanceFlowRepository = $balanceFlowRepository;
        $this->tripCancellationFeeBalanceService = $tripCancellationFeeBalanceService;
        $this->tripPaymentFormRepository = $tripPaymentFormRepository;
        $this->companyWorkerRepository = $companyWorkerRepository;
        $this->driverBalanceService = $driverBalanceService;
    }

    /**
     * @param Trip $trip
     * @param $customerBalanceId
     * @param Driver $driver
     * @return array
     * @throws \Exception
     */
    public function splitTripPayment(Trip $trip, $customerBalanceId, Driver $driver): array
    {
        $customerBalance = null;

        $tripPaymentForm = $this->tripPaymentFormRepository
            ->find($trip->tripPaymentFormId);

        switch (((int)$tripPaymentForm->paymentFormTypeId)) {
            case PaymentFormTypeConst::VOUCHER:
                $customerBalance = $this->subBalanceAfterFinishTrip($customerBalanceId, $trip);
                break;

            case PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE:
                $worker = $this->companyWorkerRepository
                    ->findByUser($trip->userId);

                $customerBalance = $this->subBalanceAfterFinishTrip($worker->balanceId, $trip, true);
        }

        $cancellationFee = $this->tripCancellationFeeBalanceService
            ->manageFee($trip, $driver->balanceId);

        $driverBalance = $this->driverBalanceService
            ->setTripCancellationFee($cancellationFee)
            ->addBalanceOnCustomerTrip($driver, $trip);

        return array_merge(compact('customerBalance'), $driverBalance);
    }

    public function subBalanceAfterFinishTrip($balanceId, Trip $trip, $administrative = false)
    {
        $balance = $this->balanceRepository->find($balanceId);
        $balance->withheldBalance -= $trip->price;

        if ($balance->withheldBalance < 0)
            $balance->withheldBalance = 0;

        $balance->save();

        $this->balanceFlowRepository->insert($trip->price, ($administrative ?
            CompanyBalanceConst::TRIP_BALANCE_OUT :
            CustomerBalanceConst::BALANCE_OUT), $balanceId, $trip->tripReference);

        return $balance;
    }
}
