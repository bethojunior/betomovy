<?php

namespace app\services;

use app\constant\PaymentFormTypeConst;
use app\constant\PushActionConst;
use app\constant\PushConst;
use app\dao\BalanceDao;
use app\dao\CustomerBalanceDao;
use app\dao\CustomerDao;
use app\dao\DriverDao;
use app\dao\LogDao;
use app\dao\OriginDao;
use app\dao\TripBidDao;
use app\dao\TripDao;
use app\dao\TripPaymentFormDao;
use app\dao\TripRefusedDao;
use app\dao\TripScheduledDao;
use app\dao\UserDao;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\exceptions\VoucherPurchaseException;
use app\model\Trip;
use app\model\TripBid;
use app\realtime\MessagesChatTripRealtime;
use app\realtime\TripRealtime;
use app\realtime\TripRouteRealtime;
use app\utils\DirectionService;
use app\utils\Push;
use app\validator\TripBidValidator;
use Exception;

class TripBidService 
{
    private $validator;
    private $dao;
    private $tripRealtime;
    private $tripCardPaymentService;
    private $tripPaymentFormDao;
    private $tripRefusedDao;

    public function __construct()
    {
        $this->validator = new TripBidValidator;
        $this->tripCardPaymentService = new CustomerTripPaymentService;
        $this->dao = new TripBidDao;
        $this->tripRealtime = new TripRealtime;
        $this->tripPaymentFormDao = new TripPaymentFormDao;
        $this->tripRefusedDao = new TripRefusedDao();
    }

    public function create($request)
    {
        $this->validator->validateNewBid($request);

        if ($this->dao->hasTripBidByDriver($request->tripId, $request->driverId))
            throw new Exception("Lance para essa viagem já efetuado");

        $driver = (new DriverDao)->find($request->driverId, true);

        $origin = (new OriginDao)->findByTripId($request->tripId);

        $estimative = (new DirectionService)->getDistance(
            $driver->latitude,
            $driver->longitude,
            $origin->latitude,
            $origin->longitude
        );

        $tripBid = new TripBid;
        $tripBid
            ->setDriverId($request->driverId)
            ->setPrice($request->price)
            ->setOldPrice($request->oldPrice)
            ->setTripId($request->tripId)
            ->setDistance($estimative->distance)
            ->setDuration($estimative->duration / 60)
            ->setId((new TripBidDao)->sqlInsert($tripBid));

        $trip = (new TripDao)->findById($request->tripId);

        $this->notifyCustomerNewQuoteHasArrived($trip->userDeviceToken);

        $trip = (new TripDao)->find($trip->tripReference);

        $this->tripRealtime
            ->hydrate($trip)
            ->updateTrip();
        return $tripBid;
    }

    public function findTripBidByDriver($request)
    {
        return $this->dao->hasTripBidByDriver($request->tripId, $request->driverId) ?? null;
    }

    public function getBidsByTrip($request)
    {
        if (!isset($request->tripId))
            throw new Exception("tripId é requirido");

        return $this->dao->getBidsByTrip($request->tripId);
    }

    public function acceptOffer($request)
    {
        if (!isset($request->tripBidId))
            throw new Exception("tripBidId é requirido");

        $tripBid = $this->dao->find($request->tripBidId);

        if (empty($tripBid))
            throw new Exception("Nenhuma oferta encontrada");

        $tripSchedule = (new TripScheduledDao)->findByTrip($tripBid->tripReference);

        $tripSimple = (new TripDao)->findObject($tripBid->tripReference);

        try {
            $this->transactionOffer($tripSimple, $request->mpToken ?? null, $tripBid->price);
        }  catch (CheckoutCardException|CheckoutServiceException|VoucherPurchaseException $exception) {
            $this->updateTripOnPaymentRefused($tripSimple->getTripReference());
            
            $this->deleteRealtime($tripSimple->getTripReference());

            (new LogDao)->logException($exception);

            throw $exception;
        } catch (Exception $exception) {
            $this->updateTripOnPaymentRefused($tripSimple->getTripReference());
            
            $this->deleteRealtime($tripSimple->getTripReference());

            (new LogDao)->logException($exception);

            throw $exception;
        }

        $status = (empty($tripSchedule)) ? Trip::ACCEPTED : Trip::SCHEDULED;

        (new TripDao)->updateCallingDriver($tripBid->tripReference, $tripBid->driverId);

        if ($status == Trip::ACCEPTED)
            (new DriverDao)->acceptTrip($tripBid);

        (new TripDao)->acceptTripBid($tripBid->tripReference, $tripBid->driverId, $tripBid->price, $status);

        $trip = (new TripDao)->find($tripBid->tripReference);

        $driver = (new DriverDao)->find($tripBid->driverId);

        $this->tripRealtime
            ->hydrate($trip)
            ->updateTrip();

        $this->notifyDriverByTripBidAccepted($driver->deviceToken);

        return $trip;
    }

    public function transactionOffer(Trip $trip, ?string $mpToken = null, $priceOffer = null): void
    {
        $tripPaymentForm = $this->tripPaymentFormDao
            ->find($trip->getTripPaymentFormId());

        (new LogDao)->logApplication("TripBidService::transactionOffer", [
            "trip" => $trip->getTripReference(),
            "tripPaymentForm" => $tripPaymentForm,
            "mpToken" => $mpToken,
            "priceOffer" => $priceOffer
        ]);

        $hasVoucher = $tripPaymentForm->paymentFormTypeId == PaymentFormTypeConst::VOUCHER || $tripPaymentForm->paymentFormTypeId == PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE;

        (new LogDao)->logApplication("TripBidService::transactionOffer", [
            "hasVoucher" => $hasVoucher
        ]);

        if(!$hasVoucher && !$tripPaymentForm->paymentFormTypeId == PaymentFormTypeConst::CREDIT_CARD) {
            (new LogDao)->logApplication("TripBidService::transactionOffer", [
                "return" => null
            ]);
            return;
        }

        (new LogDao)->logApplication("TripBidService::transactionOffer", [
            "trip" => $trip->getTripReference(),
        ]);

        $initialPrice = $this->dao->getInitialPrice($trip->getTripReference(), true);

        (new LogDao)->logApplication("TripBidService::transactionOffer", [
            "initialPrice" => $initialPrice
        ]);

        $customer = (new CustomerDao)->findByUser($trip->getUserId());

        (new LogDao)->logApplication("TripBidService::transactionOffer", [
            "customer" => $customer
        ]);

        $price = $priceOffer ?? $trip->getPrice();

        (new LogDao)->logApplication("TripBidService::transactionOffer", [
            "initialPrice" => $initialPrice,
            "customer" => $customer,
            "price" => $price
        ]);

        if(empty($initialPrice) || $initialPrice->value === $price) {
            return;
        }

        $trip->setPrice($initialPrice->value);
        $this->tripCardPaymentService->tripPaymentOnCancel($trip, $customer->balanceId);

        (new LogDao)->logApplication("TripBidService::transactionOffer", [
            "trip" => $trip,
            "customer" => $customer
        ]);

        $trip->setPrice($price);
        $this->tripCardPaymentService->tripPayment($customer, $trip, ($initialPrice->cardId ?? null), $mpToken ?? null);

        (new LogDao)->logApplication("TripBidService::transactionOffer", [
            "trip" => $trip,
            "customer" => $customer,
            "initialPrice" => $initialPrice
        ]);
    }

    public function acceptOfferByDriver($request)
    {
        if (!isset($request->tripReference))
            throw new Exception("Viagem não encontrada");


        if (!isset($request->driverId))
            throw new Exception("Motorista não encontrado");


        $tripSchedule = (new TripScheduledDao)->findByTrip($request->tripReference);

        $tripSimple = (new TripDao)->findObject($request->tripReference);

        (new LogDao)->logApplication("TripBidService::acceptOfferByDriver", [
            "tripSchedule" => $tripSchedule,
            "tripSimple" => $tripSimple
        ]);
        
        try {

            $this->transactionOffer($tripSimple, $request->mpToken ?? null);
            
        } catch (CheckoutCardException|CheckoutServiceException|VoucherPurchaseException $exception) {

            (new LogDao)->logException($exception);

            $this->updateTripOnPaymentRefused($tripSimple->getTripReference());
            
            $this->deleteRealtime($tripSimple->getTripReference());

            throw $exception;
        } catch (Exception $exception) {

            (new LogDao)->logException($exception);

            $this->updateTripOnPaymentRefused($tripSimple->getTripReference());
            
            $this->deleteRealtime($tripSimple->getTripReference());

            throw $exception;
        }

        $status = (empty($tripSchedule)) ? Trip::ACCEPTED : Trip::SCHEDULED;

        (new TripDao)->updateCallingDriver($request->tripReference, $request->driverId);

        if ($status == Trip::ACCEPTED) {
            (new DriverDao)->acceptTrip($request);
        } else {
            (new TripDao)->acceptTripBidByDriver($request->tripReference, $request->driverId, $status);
        }
        
        $trip = (new TripDao)->find($request->tripReference);

        $user = (new UserDao)->find($trip->userId);

        $this->tripRealtime
            ->hydrate($trip)
            ->updateTrip();

        $this->notifyCustomerByTripBidAccepted($user->deviceToken);

        return $trip;
    }

    private function notifyDriverByTripBidAccepted($deviceToken)
    {
        $push = new Push;
        $push
            ->setDeviceToken($deviceToken)
            ->setAction(PushActionConst::OPEN_APP)
            ->setForceStart(PushConst::FORCE_START)
            ->setPriority(PushConst::HIGH_PRIORITY)
            ->setTitle("Viagem licitada")
            ->setBody("Seu lance foi aceito pelo cliente");

        return $push->notificationAllWithData([$deviceToken]);
    }


    private function notifyCustomerByTripBidAccepted($deviceToken)
    {
        $push = new Push;
        $push
            ->setDeviceToken($deviceToken)
            ->setTitle("Pedido aceito")
            ->setAction(PushActionConst::OPEN_APP)
            ->setForceStart(PushConst::FORCE_START)
            ->setPriority(PushConst::HIGH_PRIORITY)
            ->setBody("Oferta de pedido aceito!");

        return $push->notificationAllWithData([$deviceToken]);
    }

    private function notifyCustomerNewQuoteHasArrived(?string $deviceToken)
    {
        if (!$deviceToken)
            return null;

        $push = new Push;
        $push
            ->setDeviceToken($deviceToken)
            ->setTitle("Oferta")
            ->setBody('Você recebeu uma nova oferta para seu pedido!')
            ->setPriority(PushConst::HIGH_PRIORITY);

        return $push->notificationAllWithData([$deviceToken]);
    }

    public function refuse($request)
    {
        if (!isset($request->tripBidId))
            throw new Exception("tripBidId é requirido");

        $this->dao->refuse($request->tripBidId);

        $tripBid = $this->dao->find($request->tripBidId);

        $driver = (new DriverDao)->find($tripBid->driverId);

        $this->notifyRefuseTripBidDriver($driver->deviceToken);

        $trip = (new TripDao)->find($tripBid->tripReference);

        $this->tripRealtime
            ->hydrate($trip)
            ->updateTrip();

        return $tripBid;
    }

    private function notifyRefuseTripBidDriver($deviceToken)
    {
        $push = new Push;
        $push
            ->setDeviceToken($deviceToken)
            ->setTitle("Oferta recusada")
            ->setBody("Sua oferta foi recusada!")
            ->setPriority(PushConst::HIGH_PRIORITY);

        return $push->notificationAllWithData([$deviceToken]);
    }

    private function notifyPriceChanging(array $deviceTokens)
    {

        $push = new Push;
        $push
            ->setTitle("Viagem alterada")
            ->setBody("Sua oferta foi desabilitada devido a uma alteração de preço!")
            ->setPriority(PushConst::HIGH_PRIORITY);

        return $push->notificationAllWithData($deviceTokens);
    }

    public function changePriceTrip($request)
    {
        if (!isset($request->tripReference)) {
            throw new Exception("Viagem não encontrada");
        }

        if (!isset($request->price)) {
            throw new Exception("Novo valor não informado");
        }

        $tripDao = new TripDao;

        $trip = $tripDao->findObject($request->tripReference);

        $tripPaymentForm =  $this->tripPaymentFormDao
        ->find($trip->getTripPaymentFormId());

        $hasVoucher = $tripPaymentForm->paymentFormTypeId == PaymentFormTypeConst::VOUCHER || $tripPaymentForm->paymentFormTypeId == PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE;

        $tripBids = $this->dao->getBidsByTrip($trip->getIdTrip());

        $deviceTokens = array_map(function ($tripBid) {
            return $tripBid->deviceToken;
        }, $tripBids);

        if (count($deviceTokens) > 0) {
            $this->notifyPriceChanging($deviceTokens);
        }

        if (!empty($tripBids)) {
            $this->dao->disableAllBidsByTrip($trip->getIdTrip());
        }

        $tripDao->changePriceTrip($request->tripReference, $request->price, $trip->getPrice());

        (new LogDao)->logApplication("TripBidService::changePriceTrip", [
            "tripReference" => $request->tripReference,
            "price" => $request->price,
            "trip" => $trip,
            "tripBids" => $tripBids,
            "deviceTokens" => $deviceTokens
        ]);

        if($hasVoucher){
            try {
                $this->transactionOffer($trip, null, $request->price);
            } catch (Exception $exception) {

                (new LogDao)->logException($exception);
    
                $this->updateTripOnPaymentRefused($trip->getTripReference());
                
                $this->deleteRealtime($trip->getTripReference());
    
                throw $exception;
            }
        }

        $fullyTrip = $tripDao->findFully($request->tripReference);

        $this->tripRefusedDao->deleteByTripId($trip->getIdTrip());

        $this->tripRealtime
            ->hydrate($fullyTrip)
            ->updateTrip();

        return $fullyTrip;
    }

    private function updateTripOnPaymentRefused($tripReference)
    {
        $tripDao = new TripDao;

        return $tripDao
            ->cancelByCustomer(
                $tripReference,
                now(),
                Trip::PAYMENT_REFUSED
            );
    }

    private function deleteRealtime($tripReference)
    {
        (new MessagesChatTripRealtime())
            ->deleteAll($tripReference);

        $this->tripRealtime
            ->setTripReference($tripReference)
            ->deleteTrip();

        (new TripRouteRealtime())
            ->setDocumentId($tripReference)
            ->delete();
    }
}