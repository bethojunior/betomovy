<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/07/2020
 * Time: 13:57
 */

namespace App\Services\Driver;


use App\Models\User\Driver\DriverFormOfPaymentBlocked;
use App\Models\User\Driver\DriverFormOfPaymentImposition;
use App\Repositories\User\Driver\DriverFormOfPaymentBlockedRepository;
use App\Repositories\User\Driver\DriverFormOfPaymentImpositionRepository;
use App\Repositories\User\Driver\DriverFormOfPaymentRepository;

class DriverFormOfPaymentService
{
    /**
     * @var DriverFormOfPaymentRepository
     */
    private $repository;
    /**
     * @var DriverFormOfPaymentBlockedRepository
     */
    private $driverFormOfPaymentBlockedRepository;

    /**
     * @var DriverFormOfPaymentImpositionRepository
     */
    private $driverFormOfPaymentImpositionRepository;

    public function __construct(DriverFormOfPaymentRepository $repository,
                                DriverFormOfPaymentBlockedRepository $driverFormOfPaymentBlockedRepository,
                                DriverFormOfPaymentImpositionRepository $driverFormOfPaymentImpositionRepository)
    {
        $this->repository = $repository;
        $this->driverFormOfPaymentBlockedRepository = $driverFormOfPaymentBlockedRepository;
        $this->driverFormOfPaymentImpositionRepository = $driverFormOfPaymentImpositionRepository;
    }

    public function findByDriver(int $driverId)
    {
        return $this->repository
            ->findByDriver($driverId);
    }

    public function findBlockedByDriver(int $driverId)
    {
        return $this->driverFormOfPaymentBlockedRepository
            ->findByDriver($driverId);
    }

    public function blockFormOfPayment(int $driverId, array $request)
    {
        \DB::beginTransaction();

        try {
            $this->driverFormOfPaymentBlockedRepository
                ->deleteAllByDriver($driverId);
            foreach ($request['tripPaymentForms'] as $tripPaymentFormId) {
                $driverFormOfPaymentBlocked = new DriverFormOfPaymentBlocked;
                $driverFormOfPaymentBlocked->driverId = $driverId;
                $driverFormOfPaymentBlocked->tripPaymentFormId = $tripPaymentFormId;
                $driverFormOfPaymentBlocked->save();
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $this->findBlockedByDriver($driverId);
    }

    public function findByDriverImposition(int $driverId)
    {
        return $this->driverFormOfPaymentImpositionRepository
            ->findByDriver($driverId);
    }

    public function impositionFormOfPayment(int $driverId, array $request)
    {
        \DB::beginTransaction();

        try {
            $this->driverFormOfPaymentImpositionRepository
                ->deleteAllByDriver($driverId);
            foreach ($request['tripPaymentForms'] as $tripPaymentFormId) {
                $driverFormOfPaymentImposition = new DriverFormOfPaymentImposition;
                $driverFormOfPaymentImposition->driverId = $driverId;
                $driverFormOfPaymentImposition->tripPaymentFormId = $tripPaymentFormId;
                $driverFormOfPaymentImposition->save();
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $this->findByDriverImposition($driverId);
    }
}
