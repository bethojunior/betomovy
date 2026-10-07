<?php

namespace app\services;

use app\constant\RecalculatedTripTypeConst;
use app\constant\TransactionTypeConst;
use app\dao\RewardCampaignTripDao;
use app\dao\TransactionDao;
use app\dao\TripDao;
use app\dao\TripPixPaymentsDao;
use app\dao\TripRouteTracingDao;
use app\dao\RecalculatedTripDao;
use app\dao\TripLongDistanceValueDao;
use app\dao\UserDao;
use app\model\Config;
use Exception;
use stdClass;
use app\model\Trip;
use app\model\TripAudit;
use app\model\TripPixPayments;
use app\model\TripRouteTracing;
use app\model\TripWayPoint;
use Carbon\Carbon;
use app\services\RecalculatedPriceService;
use app\utils\Headers;
use app\validator\TripActiveValidator;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 10/09/2018
 * Time: 16:46
 */
class TripService
{
    private $rewardTripService;
    private $rewardCampaignTripDao;
    private $tripRouteTracingDao;
    private $transactionDao;
    private TripDao $tripDao;
    private TripLongDistanceValueDao $longDistanceDao;
    private RecalculatedTripDao $recalculatedTripDao;
    private RecalculatedPriceService $recalculatedPriceService;

    public function __construct()
    {
        $this->rewardTripService = new RewardTripService;
        $this->rewardCampaignTripDao = new RewardCampaignTripDao;
        $this->tripRouteTracingDao = new TripRouteTracingDao;
        $this->transactionDao = new TransactionDao;
        $this->tripDao = new TripDao;
        $this->longDistanceDao = new TripLongDistanceValueDao;
        $this->recalculatedTripDao = new RecalculatedTripDao;
        $this->recalculatedPriceService = new RecalculatedPriceService;
    }

    /**
     * @param array $statusTrips
     * @return array
     * @throws Exception
     */
    public function mountTimelineStatus(array $statusTrips)
    {
        return array_map(function ($status) {
            $colorInfo = $this->getDistanceByTripStatus(
                $status->data,
                isset($status->data->confirmedWayPoint) ?
                    new TripWayPoint($status->data->confirmedWayPoint) :
                    null
            );

            $timeline = new stdClass;
            $timeline->date = $status->date;
            $timeline->tripStatus = isset($status->data->confirmedWayPoint) ?
                'waypoint_confirmed' :
                $status->data->status;
            $timeline->info = $colorInfo;

            return $timeline;
        }, $statusTrips);
    }

    /**
     * @param $trip
     * @param null|TripWayPoint $tripWayPoint
     * @return int
     * @throws Exception
     */
    public function getUpdateTripAuditId($trip, ?TripWayPoint $tripWayPoint = null)
    {
        $distance = $this->getDistanceByTripStatus($trip, $tripWayPoint)['distance'];

        return $this->getTripAuditIdByDistance($distance);
    }

    /**
     * @param $trip
     * @param null|TripWayPoint $tripWayPoint
     * @return array
     * @throws Exception
     */
    private function getDistanceByTripStatus($trip, ?TripWayPoint $tripWayPoint = null)
    {
        switch ($trip->status) {
            case Trip::ACCEPTED:
                $distance = (new Distance(
                    $trip->driver->latitude,
                    $trip->driver->longitude,
                    $trip->origin->latitude,
                    $trip->origin->longitude
                ))->getDistance();

                return ['distance' => $distance, 'color' => 'green'];
            case Trip::BOARDING:
                $distance = (new Distance(
                    $trip->driver->latitude,
                    $trip->driver->longitude,
                    $trip->origin->latitude,
                    $trip->origin->longitude
                ))->getDistance();

                return ['distance' => $distance,
                    'color' => $this->getColorTimelineByDistance($distance)];
            case Trip::IN_PROGRESS && $tripWayPoint:
                $distance = (new Distance(
                    $trip->driver->latitude,
                    $trip->driver->longitude,
                    $tripWayPoint->getLatitude(),
                    $tripWayPoint->getLongitude()
                ))->getDistance();

                return ['distance' => $distance,
                    'color' => $this->getColorTimelineByDistance($distance)];
            case Trip::IN_PROGRESS:
                $distance = (new Distance(
                    $trip->driver->latitude,
                    $trip->driver->longitude,
                    $trip->origin->latitude,
                    $trip->origin->longitude
                ))->getDistance();

                return ['distance' => $distance,
                    'color' => $this->getColorTimelineByDistance($distance)];
            case Trip::FINISHED:
                $distance = (new Distance(
                    $trip->driver->latitude,
                    $trip->driver->longitude,
                    $trip->destination->latitude,
                    $trip->destination->longitude
                ))->getDistance();

                return ['distance' => $distance,
                    'color' => $this->getColorTimelineByDistance($distance)];
        }
    }

    private function getColorTimelineByDistance($distance)
    {
        if ($distance <= TripAudit::CLOSE_DISTANCE)
            return 'green';

        if ($distance > TripAudit::CLOSE_DISTANCE && $distance <= TripAudit::MEDIUM_DISTANCE)
            return 'orange';

        return 'red';
    }

    private function getTripAuditIdByDistance($distance)
    {
        if ($distance <= TripAudit::CLOSE_DISTANCE)
            return TripAudit::RELEASED;

        if ($distance > TripAudit::CLOSE_DISTANCE && $distance <= TripAudit::MEDIUM_DISTANCE)
            return TripAudit::IN_ANALYSIS;

        return TripAudit::BLOCKED;
    }

    public function mountRewardTrip(Trip $trip)
    {
        $rewardTrip = $this->rewardTripService
            ->findOne($trip->getRewardTripId());

        $sumReward = $this->getCampaignRewardsValue($trip->getTripReference());

        if ($rewardTrip) {
            $rewardTrip->value += $sumReward;

            return $rewardTrip;
        }

        if ($sumReward > 0)
            return (object)['value' => $sumReward];

        return null;
    }

    public function getShareLink($request)
    {
        $tripReference = $request->tripReference ?? '';

        $link = Config::get('trip_sharing_link');

        $link = str_replace('{tripReference}', $tripReference, $link);

        return $link;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function updateRouteTracing($request)
    {
        $this->validateUpdateRouteTracing($request);

        $routeExists = $this->tripRouteTracingDao
            ->findByTrip($request->tripReference);

        if (empty($routeExists)) {
            $routeTracing = new TripRouteTracing;
            $routeTracing
                ->setTripReference($request->tripReference)
                ->setTracing($request->tracing);

            $this->tripRouteTracingDao->sqlInsert($routeTracing);

            return true;
        }

        $this->tripRouteTracingDao
            ->updateRoute($request->tripReference, $request->tracing);

        return true;
    }

    public function findLastTripByUser($userId)
    {
        return (new TripDao())->findLastTripByUser($userId);
    }

    public function payWithPixAtEnd($request)
    {
        $request->tripReference;

        $checkout = new CheckoutService();
        $userDao  = new UserDao();

        $userId = Headers::getUserId();
        $user = $userDao->find($userId, ["name", "email", "document"]);

        $data = [
            "amount" => (float) $request->amount * 100,
            "customer" => [
                "name" => $user->name,
                "email" => $user->email,
                "documentNumber" => $user->document,
            ],
            "dueDate" => Carbon::now()->addMinutes(10)
        ];

        [$transaction, $payment] = $checkout->pixPayment($data, TransactionTypeConst::TRIP_END);

        $dao = new TripPixPaymentsDao();

        $tripPixPayment = new TripPixPayments();
        $tripPixPayment
            ->setTripReference($request->tripReference)
            ->setIdTransaction($transaction->getIdTransaction());

        $tripPixPayment = $dao->insertTripPixPayment($tripPixPayment);

        $objReturn = new \stdClass();
        $objReturn = $transaction->toArray();

        return $objReturn;
    }

    public function pixStatus()
    {
        $transactionId = $_GET['transactionId'] ?? null;

        if(!$transactionId) {
            throw new Exception("Transaction ID não enviado");
        }

        $transaction = $this->transactionDao->find($transactionId);

        return $transaction;
    }

    /**
     * @param $request
     * @throws Exception
     */
    private function validateUpdateRouteTracing($request)
    {
        if (!isset($request->tripReference))
            throw new Exception("Viagem não foi enviada");

        if (!isset($request->tracing))
            throw new Exception("Rota não foi enviada");
    }

    /**
     * @param $tripReference
     * @return float
     */
    private function getCampaignRewardsValue($tripReference): float
    {
        $rewards = $this->rewardCampaignTripDao
            ->findByTrip($tripReference);

        $sum = 0;

        foreach ($rewards as $reward) {
            $sum += $reward->value;
        }

        return (float)$sum;
    }

    public function generatePix($request)
    {
        $this->validateGeneratePix($request);

        $checkoutService = new CheckoutService;
        $userDao = new UserDao();

        $userId = Headers::getUserId();
        $user = $userDao->find($userId, ["name", "email", "document"]);
        
        $request->name = $user->name;
        $request->email = $user->email;
        $request->documentNumber = $user->document;

        [$transaction, $payment] = $checkoutService->pixPayment(
            [
                'amount' => $request->amount * 100,
                'dueDate' => Carbon::now()->addMinutes(10),
                'customer' => [
                    'name' => $request->name,
                    'email' => $request->email,
                    'documentNumber' => $request->documentNumber,
                ],
            ],
            TransactionTypeConst::TRIP
        );

        $objReturn = new \stdClass();
        $objReturn = $transaction->toArray();

        return $objReturn;
    }

    public function validateGeneratePix($request)
    {
        if (!isset($request->amount))
            throw new Exception("Valor do PIX não foi enviado");
    }

    public function applyLongDistancePrice(object $trip): void
    {
        if (is_null($trip) || is_null($trip->driverId)) return;
        
        $tripReference = $trip->tripReference;
        $type = RecalculatedTripTypeConst::LONG_DISTANCE_RECALCULATION;

        $tripLongDistanceValue = $this->longDistanceDao
            ->findByDriverAndTrip($trip->idTrip, $trip->driverId);

        $recalculatedTripPrice = $this->recalculatedTripDao
            ->findByTripAndRecalculatedTripType($tripReference, $type);

        if (!empty($tripLongDistanceValue) && empty($recalculatedTripPrice)) {
            $newPrice = $trip->price + $tripLongDistanceValue->value;
    
            $this->recalculatedPriceService->create(
                (object) [
                    'tripReference' => $tripReference,
                    'oldPrice' => $trip->price,
                    'newPrice' => $newPrice
                ], $type
            );
    
            $this->tripDao->updatePrice($tripReference, $newPrice);
        }
    }

    public function getActives($request)
    {
        (new TripActiveValidator)->validateRequest($request);
        
        $field = $request->field === 'driver' ? 'driverId' : 'userId';
        
        return $this->tripDao->getActivesByActor($field, $request->id);
    }

    public function getStatusByTripReference(string $tripReference)
    {
        if (!is_string($tripReference) || empty($tripReference)) {
            throw new Exception("tripReference inválido");
        }

        $trip = $this->tripDao->findStatus($tripReference);

        if (empty($trip)) {
            throw new Exception("Viagem não encontrada");
        }
        
        return $trip;
    }
}