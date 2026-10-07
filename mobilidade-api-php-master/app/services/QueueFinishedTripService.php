<?php

namespace app\services;

use app\constant\CustomerBalanceConst;
use app\constant\TripCallTypeConst;
use app\dao\BalanceDao;
use app\dao\CustomerDao;
use app\dao\QueueFinishedTripDao;
use app\dao\SaleTripDao;
use app\traits\SqlTrait;
use app\utils\Connection;
use Exception;
use app\model\QueueFinishedTrip;

class QueueFinishedTripService
{
    use SqlTrait;

    private $queueFinishedTripDao;
    private $saleTripDao;
    private $balanceDao;
    private $customerDao;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->queueFinishedTripDao = new QueueFinishedTripDao;
        $this->saleTripDao = new SaleTripDao;
        $this->balanceDao = new BalanceDao;
        $this->customerDao = new CustomerDao;
    }

    public function getAll()
    {
        return $this->queueFinishedTripDao->getAll();
    }

    public function newTrip($trip)
    {

        try {
            $this->conn->beginTransaction();
            if (TripCallTypeConst::NORMAL != $trip->tripCallTypeId)
                return false;

            $promotion = $this->saleTripDao->findByCity($trip->cityId);


            if ($promotion) {
                $idQueueTrip = $this->createNewQueue($trip);
                $customer = $this->customerDao->findByUserForPromotion($trip->customer->idUser);
                $calculatePromotion = $this->calculatePromotion($promotion, $trip, $customer->balanceId ?? null);

                $this->conn->commit();

                return [
                    'idQueueFinishedTrip' => $idQueueTrip,
                    'promotionValue' => $calculatePromotion ?? 0,
                ];
            }

        } catch (Exception $exception) {
            $this->conn->rollBack();
        }

        return false;

    }

    private function createNewQueue($trip)
    {
        $queueFinishedTrip = new QueueFinishedTrip;
        $queueFinishedTrip->setIdTrip($trip->idTrip);
        $queueFinishedTrip->setDate($trip->date);
        $queueFinishedTrip->setIdUser($trip->userId);
        $queueFinishedTrip->setPrice($trip->price);
        $queueFinishedTrip->setUsed(0);

        return $this->queueFinishedTripDao->newTrip($queueFinishedTrip);
    }

    private function calculatePromotion($promotion, $trip, $balanceId)
    {
        switch ($promotion->type) {
            case 'voucher':
                $totalTrips = $this->queueFinishedTripDao->getAllUserTrips($trip->userId);
                $totalTrips = $totalTrips->quantity ?? false;

                if (!$balanceId) {
                    return false;
                }

                if ($totalTrips >= $promotion->quantity) {
                    $amount = $this->queueFinishedTripDao->avgTripCalculation($trip->userId, $promotion->quantity);
                    $amount = $amount->tripAvg ?? 0;

                    $balance = $this->addBalance($balanceId, $amount);

                    $this->queueFinishedTripDao->useAllUserSaleTrips($trip->userId);

                    return $balance;
                }

                return false;
            case 'trip':
                $totalTrips = $this->queueFinishedTripDao->getAllUserTrips($trip->userId);
                $totalTrips = $totalTrips->quantity ?? false;

                if ($totalTrips >= $promotion->quantity) {
                    $discountCouponUser =
                        (new UserDiscountCouponService())->insertByPromotion($promotion->id, $trip->userId);

                    (new QueueFinishedTripDao)->useAllUserSaleTrips($trip->userId);

                    return $discountCouponUser;
                }

                return false;
            default:
                return false;
        }
    }

    private function addBalance($balanceId, $amount)
    {
        $balance = $this->balanceDao
            ->find($balanceId);

        if (!$balance) {
            return false;
        }

        $balance->tripBalance += $amount;

        $this->balanceDao->updateTripBalance($balanceId, $balance->tripBalance);

        $balanceFlow = (new BalanceFlowService())->insertBalanceFlowPromotion(CustomerBalanceConst::VOUCHER_BONUS, $amount, $balanceId);

        if (!$balanceFlow) {
            return false;
        }

        return $balance;
    }
}
