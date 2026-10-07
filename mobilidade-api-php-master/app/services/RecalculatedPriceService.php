<?php

namespace app\services;

use app\constant\CompanyBalanceConst;
use app\constant\CustomerBalanceConst;
use app\constant\PaymentFormTypeConst;
use app\constant\PushActionConst;
use app\constant\PushTagConst;
use app\constant\RecalculatedTripTypeConst;
use app\dao\BalanceDao;
use app\dao\CentralDao;
use app\dao\CompanyWorkerDao;
use app\dao\DestinationDao;
use app\dao\DriverDao;
use app\dao\LogDao;
use app\dao\PushConfigDao;
use app\dao\RecalculatedTripDao;
use app\dao\TripDao;
use app\dao\TripPaymentFormDao;
use app\dao\TripWayPointDao;
use app\dao\UserDao;
use app\exceptions\CheckoutServiceException;
use app\exceptions\RecalculatedTripException;
use app\model\Config;
use app\model\Destination;
use app\model\PushConfig;
use app\model\RecalculatedTrip;
use app\model\Trip;
use app\realtime\TripRealtime;
use app\utils\Connection;
use app\utils\Push;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/11/2019
 * Time: 10:28
 */
class RecalculatedPriceService
{
    private $recalculatedTripDao;
    private $tripDao;
    private $tripRealtime;
    private $conn;
    private $tripPaymentFormDao;
    private $companyWorkerDao;
    private $recalculatedTripCardPaymentService;

    /**
     * @var null|PushConfig
     */
    private $defaultPush;

    /**
     * RecalculatedPriceService constructor.
     * @throws CheckoutServiceException
     */
    public function __construct()
    {
        $this->recalculatedTripDao = new RecalculatedTripDao;
        $this->tripDao = new TripDao;
        $this->tripRealtime = new TripRealtime;
        $this->tripPaymentFormDao = new TripPaymentFormDao;
        $this->companyWorkerDao = new CompanyWorkerDao;
        $this->recalculatedTripCardPaymentService = new RecalculatedTripCardPaymentService;
        $this->conn = Connection::open();

        $this->defaultPush = (new PushConfigDao)
            ->find('notify_in_error_payment_recalculation');
    }

    /**
     * @param $request
     * @param int $recalculatedTripTypeId
     * @return bool
     * @throws Exception
     */
    public function create($request, int $recalculatedTripTypeId = RecalculatedTripTypeConst::TRIP_ROUTE_RECALCULATION)
    {
        $this->validateCreate($request);

        $existingRecalculation = $this->findExistingRecalculation(
            $request->tripReference, $recalculatedTripTypeId
        );

        if (!empty($existingRecalculation))
            return $existingRecalculation;

        try {
            $this->conn->beginTransaction();

            $trip = $this->tripDao->find($request->tripReference);

            // A validação abaixo foi comentada para permitir que o recálculo da corrida
            // possa resultar em um valor menor que o original. Anteriormente, o backend
            // impedia que o novo preço fosse inferior ao preço antigo.
            // if (!((boolean)Config::get('enable_floating_price_recalculation')))
            //     if ($request->oldPrice > $request->newPrice)
            //         throw new RecalculatedTripException(1600);

            $recalculatedTrip = $this->new($trip->tripReference, $request, $recalculatedTripTypeId);

            $resultElectronicPayment = $this->debitElectronicPayment($recalculatedTrip, new Trip($trip));

            if (!$resultElectronicPayment) {
                $message =
                    $this->notifyDriver(new Trip($trip), $recalculatedTrip);

                $recalculatedTrip
                    ->setMessage($message)
                    ->setValueDiffError($request->newPrice - $request->oldPrice)
                    ->setNewPrice($request->oldPrice);
            }

            $this->tripDao
                ->updatePrice($request->tripReference, $recalculatedTrip->getNewPrice());

            if (!$recalculatedTrip->getId())
                $recalculatedTrip
                    ->setId($this->recalculatedTripDao
                        ->sqlInsert($recalculatedTrip));
            else
                $this->update($recalculatedTrip);

            $trip = $this->tripDao->find($request->tripReference);

            $this->conn->commit();

            $this->tripRealtime
                ->hydrate($trip)
                ->createTrip();

        } catch (Exception $e) {

            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            (new LogDao)->logException($e);
            throw $e;
        }

        return $trip->recalculatedPrice;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    private function validateCreate($request)
    {
        if (!isset($request->tripReference))
            throw new Exception("ID da viagem não foi enviado");

        if (!isset($request->newPrice) || !is_numeric($request->newPrice))
            throw new Exception("Novo preço está inválido");

        if (!isset($request->oldPrice) || !is_numeric($request->oldPrice))
            throw new Exception("O valor antigo está inválido");

        return true;
    }

    /**
     * @param string $tripReference
     * @param int $recalculatedTripTypeId
     * @return mixed|null
     */
    private function findExistingRecalculation(string $tripReference, int $recalculatedTripTypeId)
    {
        $recalculateExists = $this->recalculatedTripDao
            ->findByTripAndRecalculatedTripType($tripReference, $recalculatedTripTypeId);

        if (empty($recalculateExists)) {
            return null;
        }

        return end($recalculateExists);
    }

    private function debitElectronicPayment(RecalculatedTrip $recalculatedTrip, Trip $trip)
    {
        // pagar a diferença do preço quando a corrida tem recalculo e a forma de pagamento é eletronica
        $tripPaymentForm = $this->tripPaymentFormDao
            ->find($trip->getTripPaymentFormId());

        switch (((int)$tripPaymentForm->paymentFormTypeId)) {
            case PaymentFormTypeConst::VOUCHER:
                return $this->debitByVoucher(
                    $trip,
                    ($recalculatedTrip->getNewPrice() - $recalculatedTrip->getOldPrice()));

            case PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE:
                return $this->debitByAdministrativeVoucher(
                    $trip,
                    ($recalculatedTrip->getNewPrice() - $recalculatedTrip->getOldPrice()));

            case PaymentFormTypeConst::VOUCHER_CENTRAL:
                return $this->debitByVoucherCentral(
                    $trip,
                    ($recalculatedTrip->getNewPrice() - $recalculatedTrip->getOldPrice()));

            case PaymentFormTypeConst::CREDIT_CARD:
                return $this->debitByCreditCardPayment($trip, $recalculatedTrip);

            case PaymentFormTypeConst::DEBIT_CARD:
                return $this->debitByDebitCardPayment($trip, $recalculatedTrip);
        }

        return true;
    }

    private function new(
        $tripReference, $request, int $recalculatedTripTypeId = RecalculatedTripTypeConst::TRIP_ROUTE_RECALCULATION): RecalculatedTrip
    {
//        $recalculatedTrip = $this->recalculatedTripDao->findByTrip($tripReference);

        $recalculatedTrip = new RecalculatedTrip;
        $recalculatedTrip
            ->setTripReference($request->tripReference)
            ->setNewPrice($request->newPrice)
            ->setOldPrice($request->oldPrice)
            ->setRecalculatedTripTypeId($recalculatedTripTypeId)
            ->setNewDistance($request->newDistance ?? null)
            ->setNewTripTime($request->newTripTime ?? null);

        return $recalculatedTrip;
    }

    private function debitByVoucher(Trip $trip, $value)
    {
        try {
            $balanceDao = new BalanceDao;

            $customer = (new UserDao)
                ->findWithBalance($trip->getUserId());

            $balance = $balanceDao->find($customer->balanceId);

            if ($balance->tripBalance < $value)
                throw new Exception("Você não possui saldo suficiente");

            $trip->setPrice($value);

            $customer->balance = $balanceDao
                ->subBalanceForNewTrip(
                    $customer->balanceId, $trip, CustomerBalanceConst::TRIP_BALANCE_LOCKOUT);

        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    private function debitByVoucherCentral(Trip $trip, $value)
    {
        try {
            $balanceDao = new BalanceDao;

            $central = (new CentralDao)
                ->find($trip->getUserId());

            $centralBalance = $balanceDao->find($central->balanceId);

            if ($centralBalance->balance < $value)
                throw new Exception("Você não possui saldo suficiente");

            $trip->setPrice($value);

            $balanceDao->subBalanceForNewTripCentral(
                $centralBalance->idBalance, $trip, CompanyBalanceConst::TRIP_BALANCE_OUT);

        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    /**
     * @param Trip $trip
     * @param $value
     * @return bool
     */
    private function debitByAdministrativeVoucher(Trip $trip, $value)
    {
        try {
            $worker = $this->companyWorkerDao
                ->findWithCompany($trip->getUserId());

            if (!$worker)
                throw new Exception("Esse tipo de pagamento não está habilitado para você");

            if ($worker->tripBalance < $value)
                throw new Exception("Empresa não possui saldo suficiente");

            $trip->setPrice($value);

            $worker->balance = (new BalanceDao)
                ->subBalanceForNewTrip(
                    $worker->balanceId, $trip, CompanyBalanceConst::TRIP_BALANCE_OUT);

        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    private function debitByCreditCardPayment(Trip $trip, RecalculatedTrip $recalculatedTrip)
    {
        try {
            $this->recalculatedTripCardPaymentService
                ->discountByCreditCard($recalculatedTrip, $trip);
        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    private function debitByDebitCardPayment(Trip $trip, RecalculatedTrip $recalculatedTrip)
    {
        try {
            $this->recalculatedTripCardPaymentService
                ->discountByDebitCard($recalculatedTrip, $trip);
        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    /**
     * @param Trip $trip
     * @param RecalculatedTrip $recalculatedTrip
     * @return mixed
     */
    private function notifyDriver(Trip $trip, RecalculatedTrip $recalculatedTrip)
    {
        try {
            $driver = (new DriverDao)
                ->find($trip->getDriverId(), false);

            $currency = Config::get('application_currency');
            $diffValue = $recalculatedTrip->getNewPrice() - $recalculatedTrip->getOldPrice();
            $diffValue = number_format(
                round($diffValue, 2), 2, ',', '.');

            $message =
                str_replace(
                    '{stringValue}',
                    "{$currency} {$diffValue}",
                    $this->defaultPush->getMessage());

            $push = new Push;
            $push
                ->setBody($message)
                ->setTitle($this->defaultPush->getTitle())
                ->setAction(PushActionConst::NOTIFY_DEFAULT)
                ->setDeviceToken($driver->deviceToken);

            $push->sendNotificationWithData();

            return $message;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * @param RecalculatedTrip $recalculatedTrip
     * @return RecalculatedTrip
     * @throws Exception
     */
    private function update(RecalculatedTrip $recalculatedTrip): RecalculatedTrip
    {
        $set = [];
        $bind = [];

        foreach ($recalculatedTrip->extract() as $key => $value) {
            if ($value) {
                if ($key != 'id')
                    $set[$key] = ":$key";

                $bind[":$key"] = $value;
            }
        }

        $this->recalculatedTripDao
            ->sqlUpdate($set, [['id', '=', ':id']], $bind);

        return $recalculatedTrip;
    }

    public function changeRoute($request)
    {
        $this->validateChangeRoute($request);

        try {

            $this->conn->beginTransaction();

            $trip = (new TripDao)->find($request->tripReference);

            $recalculatedTrip = $this->new($trip->tripReference, (object)[
                'tripReference' => $request->tripReference,
                'newPrice' => $request->price,
                'oldPrice' => $trip->price,
                'newDistance' => $request->distance,
                'newTripTime' => $request->duration
            ]);

            $resultElectronicPayment = $this->debitElectronicPayment($recalculatedTrip, new Trip($trip));

            if (!$resultElectronicPayment) {
                $message =
                    $this->notifyDriver(new Trip($trip), $recalculatedTrip);

                $recalculatedTrip
                    ->setMessage($message)
                    ->setValueDiffError(((float)$request->price) - ((float)$trip->price))
                    ->setNewPrice($request->oldPrice);
            }

            $this->tripDao
                ->updatePrice($request->tripReference, $recalculatedTrip->getNewPrice());

            if (!empty($trip->tripWayPoints))
                (new TripWayPointDao)->disabled($request->tripReference);

            if (isset($request->waypoints) && !empty($request->waypoints))
                (new TripWayPointService)->insertMany($request->waypoints, $request->tripReference);

            $destination = $this->createDestination($request->destination);

            (new TripDao)->updateDestination($destination->getIdDestination(), $trip->destinationId, $request->tripReference);

            $trip = $this->tripDao->find($request->tripReference);

            $this->conn->commit();

            $push = new Push;
            $push
                ->setMessage("Cliente alterou o local do seu destino")
                ->setTitle("Alteração de rota na viagem")
                ->setAction(PushActionConst::OPEN_APP)
                ->setTag(PushTagConst::CUSTOMER_CHANGED_ROUTE)
                ->setDeviceToken($trip->driver->deviceToken);

            $push->sendNotificationWithData();

            $this->tripRealtime
                ->hydrate($trip)
                ->createTrip();

        } catch (Exception $e) {

            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            (new LogDao)->logException($e);
            throw $e;
        }

        return $trip;
    }

    private function createDestination($request): Destination
    {
        /** @var Destination $destination */
        $destination = (new DestinationDao)
            ->create($request);

        return $destination;
    }

    private function validateChangeRoute($request)
    {

        if (!isset($request->tripReference))
            throw new Exception("ID da viagem não foi enviado");

        if (!isset($request->price) || !is_numeric($request->price))
            throw new Exception("Novo preço está inválido");


        if (!isset($request->destination))
            throw new Exception("Endereço de destino inválido");
    }
}