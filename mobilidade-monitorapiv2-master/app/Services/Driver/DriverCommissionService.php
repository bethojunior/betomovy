<?php


namespace App\Services\Driver;


use App\Constants\StatusConst;
use App\Constants\Trip\CommissionTypeConst;
use App\Models\Trip\DriverCommission;
use App\Models\Trip\DriverCommissionAnotherFee;
use App\Models\Trip\Trip;
use App\Repositories\Trip\DriverCommissionAnotherFeeRepository;
use App\Repositories\Trip\DriverCommissionPaymentFormRepository;
use App\Repositories\Trip\DriverCommissionRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class DriverCommissionService
{
    private $driverCommissionRepository;
    private $driverCommissionPaymentFormRepository;
    private $driverCommissionAnotherFeeRepository;


    public function __construct(
        DriverCommissionRepository $driverCommissionRepository,
        DriverCommissionPaymentFormRepository $driverCommissionPaymentFormRepository,
        DriverCommissionAnotherFeeRepository $driverCommissionAnotherFeeRepository
    )
    {
        $this->driverCommissionRepository = $driverCommissionRepository;
        $this->driverCommissionPaymentFormRepository = $driverCommissionPaymentFormRepository;
        $this->driverCommissionAnotherFeeRepository = $driverCommissionAnotherFeeRepository;
    }

    /**
     * @param $driverCommissionId
     * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|null
     * @throws \Exception
     */
    public function find($driverCommissionId)
    {
        $commission = $this->driverCommissionRepository
            ->find($driverCommissionId);

        if (!$commission)
            throw new \Exception("Comissão não encontrada");


        $commission['paymentFormCommissions'] = $this->driverCommissionPaymentFormRepository->findByDriverCommission($driverCommissionId);
        $commission['anotherFee'] = $this->driverCommissionAnotherFeeRepository->findByDriverCommission($driverCommissionId);

        return $commission;
    }

    public function calculateCommission(DriverCommission $driverCommission, Trip $trip, float $cancellationFeeValue = 0)
    {
        $price = $trip->price - $cancellationFeeValue;

        $appCommission =
            $this->getValueByType($driverCommission->valueType, $driverCommission->value, $price);

        /**
         * Se houver outras taxas a ser acrescentadas a comissão
         * será adicionado no método abaixo
         */
        if ($driverCommission->anotherFee)
            $appCommission +=
                $this->calculateByAnotherFees($driverCommission->anotherFee, $price);

        return $appCommission;
    }

    public function findByCity(int $cityId): Collection
    {
        return $this->driverCommissionRepository->findByCity($cityId);
    }

    public function calculateRatePaymentForm($driverCommission, Trip $trip)
    {
        return $this->calculateByPaymentForm(
            $driverCommission->paymentFormCommissions->toArray(), $trip
        );
    }

    private function getValueByType($type, $commissionValue, $grossValue)
    {
        switch ($type) {
            case CommissionTypeConst::PERCENTAGE:
                return $this->percentage($grossValue, $commissionValue);
            case CommissionTypeConst::FIXED_VALUE:
                return $commissionValue;
            default:
                throw new Exception("Tipo não encontrado");
        }
    }

    private function percentage($value, $percentage)
    {
        return $value * ($percentage / 100);
    }

    private function calculateByAnotherFees(DriverCommissionAnotherFee $commissionAnotherFee, $grossValue)
    {
        $fee = $this->getValueByType(
            $commissionAnotherFee->valueType,
            $commissionAnotherFee->taxValue,
            $grossValue
        );

        $fee += $this->getValueByType(
            $commissionAnotherFee->valueType,
            $commissionAnotherFee->anotherValue,
            $grossValue
        );

        return $fee;
    }


    private function calculateByPaymentForm(array $paymentFormCommissions, Trip $trip)
    {

        $paymentFormCommission = array_filter(
            $paymentFormCommissions,
            function ($commissionPaymentForm) use ($trip) {
                $commissionPaymentForm = (object)$commissionPaymentForm;
                return $commissionPaymentForm->tripPaymentFormId == $trip->tripPaymentFormId;
            }
        );

        $paymentFormCommission = end($paymentFormCommission);

        return $paymentFormCommission ?
            $this->getValueByType(
                $paymentFormCommission['valueType'],
                $paymentFormCommission['value'],
                $trip->price
            ) :
            null;
    }

    public function store(array $request, int $cityId): DriverCommission
    {
        DB::beginTransaction();

        try {
            $this->removeIfExistsOnInsert($cityId, $request['tripTypeId']);

            /** @var DriverCommission $commission */
            $commission = $this->driverCommissionRepository->create([
                'cityId'             => $cityId,
                'tripTypeId'         => $request['tripTypeId'],
                'valueType'          => $request['valueType'] ?? '%',
                'value'              => $request['value'] ?? 0,
                'disableOnPromotion' => $request['disableOnPromotion'] ?? false,
                'statusId'           => StatusConst::ACTIVE,
            ]);

            if (isset($request['commissionAnotherFee'])) {
                $this->driverCommissionAnotherFeeRepository->create([
                    'driverCommissionId' => $commission->idDriverCommission,
                    'valueType'          => $request['commissionAnotherFee']['valueType'] ?? '%',
                    'taxValueType'       => $request['commissionAnotherFee']['taxValueType'] ?? '%',
                    'another_value'      => $request['commissionAnotherFee']['another_value'] ?? 0,
                    'tax_value'          => $request['commissionAnotherFee']['tax_value'] ?? 0,
                ]);
            }

            if (isset($request['commissionsPaymentForm'])) {
                foreach ($request['commissionsPaymentForm'] as $commissionPaymentForm) {
                    if (empty($commissionPaymentForm['value']) || $commissionPaymentForm['value'] <= 0) {
                        continue;
                    }

                    $this->driverCommissionPaymentFormRepository->create([
                        'driverCommissionId' => $commission->idDriverCommission,
                        'tripPaymentFormId'  => $commissionPaymentForm['tripPaymentFormId'],
                        'valueType'          => $commissionPaymentForm['valueType'] ?? '%',
                        'value'              => $commissionPaymentForm['value'],
                    ]);
                }
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $commission;
    }

    private function removeIfExistsOnInsert(int $cityId, int $tripTypeId): void
    {
        $this->driverCommissionRepository->removeInCityByTripType($cityId, $tripTypeId);
    }
}
