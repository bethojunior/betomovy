<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/06/2020
 * Time: 14:19
 */

namespace Delivery\Services\Order;


use App\Constants\Delivery\DeliveryOrderStatusConst;
use App\Constants\Driver\DriverCalledConst;
use App\Http\Responses\ApiResponse;
use App\Models\Driver\Driver;
use App\Repositories\City\CityRepository;
use App\Repositories\City\ZoneRepository;
use App\Repositories\Config\ConfigRepository;
use Delivery\Utils\ConfianceCheckout;
use Carbon\Carbon;
use Cash\Constants\Balance\BalanceFlowTypeConst;
use Cash\Repositories\Balance\BalanceFlowRepository;
use Cash\Repositories\Balance\BalanceRepository;
use Delivery\Constants\DeliveryOrder\OrderDeliveryTypeConst;
use Delivery\Constants\DeliveryOrder\PayMachineReturnConst;
use Delivery\Constants\DeliveryOrder\PaymentFormTypeConst;
use Delivery\Repositories\Acquirer\AcquirerMetaDataRepository;
use Delivery\Repositories\Card\CardFlagRepository;
use Delivery\Models\Company\Company;
use Delivery\Models\Company\EstablishmentCollectionManagement;
use Delivery\Models\Delivery\DeliveryRate;
use Delivery\Models\Order\DeliveryOrder;
use Delivery\Models\Order\DeliveryOrderComplement;
use Delivery\Models\Order\DeliveryOrderItem;
use App\Models\User;
use Delivery\Models\Order\DeliveryOrderPlace;
use Delivery\Models\Order\DeliveryPaymentTransactions;
use Delivery\Models\PaymentForm\Card;
use Delivery\Models\PaymentForm\DeliveryPaymentForm;
use Delivery\Realtimes\Order\OrderRealtime;
use Delivery\Repositories\Company\CompanyAddressRepository;
use Delivery\Repositories\Company\CompanyDeliveryOrderConfigRepository;
use Delivery\Repositories\Company\CompanyDeliveryTokensRepository;
use Delivery\Repositories\Delivery\PayMachineReturnRepository;
use Delivery\Repositories\Driver\DriverCalledRepository;
use Delivery\Repositories\Order\DeliveryOrderRepository;
use Delivery\Repositories\Product\DeliveryProductRepository;
use Delivery\Repositories\Promotion\UserDiscountCouponDeliveryRepository;
use Delivery\Services\PaymentForm\CardService;
use Delivery\Utils\AsaasApi;
use ExponentPhpSDK\Exceptions\ExpoException;
use ExponentPhpSDK\Exceptions\UnexpectedResponseException;
use Illuminate\Support\Collection;

class DeliveryOrderService
{
    /**
     * @var DeliveryOrderRepository
     */
    private $repository;
    /**
     * @var CompanyAddressRepository
     */
    private $companyAddressRepository;
    /**
     * @var CityRepository
     */
    private $cityRepository;
    /**
     * @var ZoneRepository
     */
    private $zoneRepository;
    /**
     * @var DriverCalledRepository
     */
    private $driverCalledRepository;

    /**
     * @var CompanyDeliveryTokensRepository
     */
    private $companyDeliveryTokensRepository;

    /**
     * @var CompanyDeliveryOrderConfigRepository
     */
    private $companyDeliveryOrderConfigRepository;

    /**
     * @var UserDiscountCouponDeliveryRepository
     */
    private $userDiscountCouponDeliveryRepository;

    /**
     * @var BalanceRepository
     */
    private $balanceRepository;

    /**
     * @var BalanceFlowRepository
     */
    private $balanceFlowRepository;

    /**
     * @var PayMachineReturnRepository
     */
    private $payMachineReturnRepository;

    /**
     * @var AcquirerMetaDataRepository
     */
    private $acquirerMetaDataRepository;

    /**
     * @var CardFlagRepository
     */
    private $cardFlagRepository;

    /**
     * @var DeliveryProductRepository
     */
    private $deliveryProductRepository;

    /**
     * @var ConfigRepository
     */
    private $configRepository;

    public function __construct(DeliveryOrderRepository              $repository,
                                CompanyAddressRepository             $companyAddressRepository,
                                CityRepository                       $cityRepository,
                                ZoneRepository                       $zoneRepository,
                                DriverCalledRepository               $driverCalledRepository,
                                CompanyDeliveryTokensRepository      $companyDeliveryTokensRepository,
                                UserDiscountCouponDeliveryRepository $userDiscountCouponDeliveryRepository,
                                CompanyDeliveryOrderConfigRepository $companyDeliveryOrderConfigRepository,
                                BalanceRepository                    $balanceRepository,
                                BalanceFlowRepository                $balanceFlowRepository,
                                PayMachineReturnRepository           $payMachineReturnRepository,
                                DeliveryProductRepository            $deliveryProductRepository,
                                ConfigRepository                     $configRepository,
                                AcquirerMetaDataRepository           $acquirerMetaDataRepository,
                                CardFlagRepository                   $cardFlagRepository
    )
    {
        $this->repository = $repository;
        $this->companyAddressRepository = $companyAddressRepository;
        $this->cityRepository = $cityRepository;
        $this->zoneRepository = $zoneRepository;
        $this->driverCalledRepository = $driverCalledRepository;
        $this->companyDeliveryTokensRepository = $companyDeliveryTokensRepository;
        $this->userDiscountCouponDeliveryRepository = $userDiscountCouponDeliveryRepository;
        $this->companyDeliveryOrderConfigRepository = $companyDeliveryOrderConfigRepository;
        $this->balanceRepository = $balanceRepository;
        $this->balanceFlowRepository = $balanceFlowRepository;
        $this->payMachineReturnRepository = $payMachineReturnRepository;
        $this->deliveryProductRepository = $deliveryProductRepository;
        $this->configRepository = $configRepository;
        $this->acquirerMetaDataRepository = $acquirerMetaDataRepository;
        $this->cardFlagRepository = $cardFlagRepository;
    }

    public function find(int $id)
    {
        $deliveryOrder = $this->repository->findFully($id);

        if ($deliveryOrder->driver)
            $deliveryOrder->driver->profileImage = $deliveryOrder->driver->profileImage;

        return $deliveryOrder;
    }

    private function isOpen($companyId)
    {
        $config = $this->companyDeliveryOrderConfigRepository->findByCompany($companyId);

        if (!$config)
            return false;

        if (!((bool)$config->isOpen))
            return false;

        return true;
    }

    public function make(array $request, User $user): DeliveryOrder
    {
        \DB::beginTransaction();

        try {

            $deliveryOrder = new DeliveryOrder($request);
            $deliveryOrder->setAttribute('deliveryOrderStatusId', DeliveryOrderStatusConst::WAITING_CONFIRMATION);
            $deliveryOrder->setAttribute('userId', $user->idUser);

            if (!$this->isOpen($request['companyId']))
                throw new \Exception("Estabelecimento está fechado");

            $companyAddress = $this->companyAddressRepository
                ->findDefaultByCompany($request['companyId']);

            $company = Company::find($request['companyId']);

            $config = $this->companyDeliveryOrderConfigRepository->findByCompany($request['companyId']);

            $city = $this->cityRepository
                ->findByCoordinate($companyAddress->latitude, $companyAddress->longitude);

            $zone = $this->zoneRepository
                ->findByCity($city->id);

            if ($deliveryOrder->orderDeliveryTypeId == OrderDeliveryTypeConst::DELIVERY || $deliveryOrder->orderDeliveryTypeId == null) {
                $payMachineReturn = $this->payMachineReturnRepository->findByCity($city->id);

                if ($deliveryOrder->deliveryPaymentForm->paymentFormTypeId == PaymentFormTypeConst::CARD_PAYMENT_IN_LOCAL) {
                    if ($payMachineReturn)
                        $deliveryOrder->setAttribute('payMachineReturnId', $payMachineReturn->id);
                }
            }

            $deliveryOrder->setAttribute('companyAddressId', $companyAddress->id);
            $deliveryOrder->setAttribute('zoneId', $zone->idZone);
            $deliveryOrder->setAttribute('cityId', $city->id);
            $deliveryOrder->setAttribute('establishmentCollectionManagementId', $company->establishmentCollectionManagementId ??
                (EstablishmentCollectionManagement::where('statusId', 1)
                    ->orderBy('id')
                    ->first())->id ??
                null
            );

            $result = $this->calculatePreviewDelivery($config->averageDeliveryTime);

            $deliveryOrder->startDeliveryTime = $result->start;
            $deliveryOrder->endDeliveryTime = $result->end;

            $enableDeliveryConfirmationCode = (bool)$this->configRepository->findByKey("enable_delivery_confirmation_code")->value;

            if ($enableDeliveryConfirmationCode) {
                $deliveryOrder->verificationCode = rand(1000,9999);
            }

            $deliveryOrder->save();

            if ($deliveryOrder->orderDeliveryTypeId == OrderDeliveryTypeConst::DELIVERY || $deliveryOrder->orderDeliveryTypeId == null) {
                $this->createDeliveryOrderPlace($deliveryOrder, $request['placeId']);
            }

            $this->deliveryItems($deliveryOrder, $request['deliveryItems']);

            if (isset($request['userDiscountCouponDeliveryId'])) {
                $userDiscountCouponDelivery = $this->userDiscountCouponDeliveryRepository->find($request['userDiscountCouponDeliveryId']);

                if ($userDiscountCouponDelivery->used)
                    throw new \Exception("Cupom já utilizado");

                $userDiscountCouponDelivery->used = true;
                $userDiscountCouponDelivery->deliveryOrderId = $deliveryOrder->id;
                $userDiscountCouponDelivery->save();
            }

            /** @var DeliveryOrder $deliveryOrder */
            $deliveryOrder = $this->repository
                ->findFully($deliveryOrder->id);

            if ($deliveryOrder->deliveryPaymentForm->paymentFormTypeId == PaymentFormTypeConst::CREDIT_CARD) {
                if (!isset($request['cardId'])) throw new \Exception('Cartão não enviado');
                $card = (new CardService())->decode(Card::findOrFail($request['cardId']));

                $acquirerData = $this->acquirerMetaDataRepository->getAcquirer(7);

                $acquirerData->map(function ($acquirer) {
                    if(empty($acquirer->value)) {
                        throw new \Exception('O aplicativo no momento está com problemas com pagamento via cartão, por favor, tente outro meio de pagamento.');
                    }
                });

                $flagName = $this->cardFlagRepository->getCardFlag($card->cardFlagId) ?? 'MASTERCARD';

                $paymentData = array(
                    'value' => $deliveryOrder->value,
                    'description' => 'Compra em delivery',
                    'customer_name' => $user['name'],
                    'customer_document' => $request['holderDocument'],
                    'customer_email' => empty($user['email']) ? 'speedapps@hotmail.com' : $user['email'],
                    'customer_birth_date' => "1999-09-10",
                    'customer_phone_number' => $user['phone'],
                    'customer_zicode' => $user['zipcode'] ?? '60010-280',
                    'customer_address' => 'S/L',
                    'customer_complement' => 'S/C',
                    'customer_number' => 'S/N',
                    'customer_city' => 'FORTALEZA',
                    'customer_state' => 'CE',
                    'card_number' => $card->number,
                    'card_holder' => $card->cardholderName,
                    'card_validate' => $card->expirationMonth . '/' . $card->expirationYear,
                    'card_cvc' => $card->cvv,
                    'card_brand' => $flagName,
                );

                $confiance = new ConfianceCheckout( $acquirerData[0]->value, $acquirerData[1]->value);
                $transactionId = $confiance->creditPayment($paymentData);

                if(!$transactionId['success']) throw new \Exception('A compra não foi aprovada');
            }

            $orderRealtime = new OrderRealtime;
            $orderRealtime
                ->insert($deliveryOrder->toArray());

            $this->notifyCompany("Novo pedido recebido", $request['companyId']);

            \DB::commit();

        } catch (\Exception $e) {
            \DB::rollBack();
            throw new \Exception($e->getMessage());
        }

        return $deliveryOrder;
    }

    /**
     * @param $response
     * @throws \Exception
     */
    public function verifyStatusPaymentInCreditCard($response)
    {
        if ($response->status != "CONFIRMED")
            throw new \Exception("Transação recusada");
    }

    /**
     * @param $message
     * @param $companyId
     * @throws \Exception
     */
    public function notifyCompany($message, $companyId)
    {
        $channelName = "new_order";

        $deliveryCompanyTokens = $this->companyDeliveryTokensRepository->findTokensByCompany($companyId);

        if (count($deliveryCompanyTokens) == 0)
            return;

        $expo = \ExponentPhpSDK\Expo::normalSetup();

        foreach ($deliveryCompanyTokens as $companyToken) {
            $expo->subscribe($channelName, $companyToken->token);
        }
        $notification = ['body' => $message];

        try {
            $expo->notify([$channelName], $notification);
        } catch (ExpoException $e) {
            //throw new \Exception($e->getMessage());
        } catch (UnexpectedResponseException $e) {
            //throw new \Exception($e->getMessage());
        }
    }

    public function accept(DeliveryOrder $deliveryOrder, User $user)
    {
        /** @var Driver $driver */
        $driver = $user->driver;

        $deliveryOrder->deliveryOrderStatusId = DeliveryOrderStatusConst::ORDER_ACCEPTED_DELIVERY_MAN;
        $deliveryOrder->driverId = $driver->idDriver;
        $deliveryOrder->save();

        $this->driverCalledRepository
            ->updateStatusByDriverAndDeliveryOrder(
                $driver->idDriver, $deliveryOrder->id, DriverCalledConst::ACCEPTED);

        /** @var DeliveryOrder $deliveryOrderFully */
        $deliveryOrderFully = $this->repository
            ->findFully($deliveryOrder->id);

        $orderRealtime = new OrderRealtime;
        $orderRealtime
            ->update([
                'id' => $deliveryOrder->id
            ], $deliveryOrderFully->toArray());

        return $deliveryOrder;
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @param User $user
     * @return bool|int
     */
    public function refuse(DeliveryOrder $deliveryOrder, User $user): bool
    {
        /** @var Driver $driver */
        $driver = $user->driver;

        return (bool)$this->driverCalledRepository
            ->updateStatusByDriverAndDeliveryOrder(
                $driver->idDriver, $deliveryOrder->id, DriverCalledConst::REFUSED);
    }

    public function finish(DeliveryOrder $deliveryOrder)
    {
        $deliveryOrder = $this->updateStatus($deliveryOrder, DeliveryOrderStatusConst::FINISHED);

        $this->feeServiceSplit($deliveryOrder);

        return $deliveryOrder;
    }

    /**
     * @param User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findActivesByCustomer(User $user)
    {
        return $this->repository
            ->findActives($user->idUser);
    }

    public function findActivesByDriver(User $user)
    {
        return $this->repository
            ->findActives($user->driver->idDriver ?? $user->idUser, false);
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @param int $deliveryOrderStatusId
     * @return DeliveryOrder
     */
    public function updateStatus(DeliveryOrder $deliveryOrder, int $deliveryOrderStatusId): DeliveryOrder
    {
        $deliveryOrder->deliveryOrderStatusId = $deliveryOrderStatusId;
        $deliveryOrder->save();

        /** @var DeliveryOrder $deliveryOrderFully */
        $deliveryOrderFully = $this->repository
            ->findFully($deliveryOrder->id);

        $orderRealtime = new OrderRealtime;
        $orderRealtime
            ->update([
                'id' => $deliveryOrder->id
            ], $deliveryOrderFully->toArray());

        return $deliveryOrderFully;
    }

    public function feeServiceSplit(DeliveryOrder $deliveryOrder)
    {
        if ($deliveryOrder->deliveryRateId) {
            $deliveryRate = DeliveryRate::find($deliveryOrder->deliveryRateId);

            $deliveryServiceFee = $deliveryRate->deliveryServiceFeeType == "%" ?
                $deliveryOrder->deliveryFee - (($deliveryOrder->deliveryFee * $deliveryRate->deliveryServiceFee) / 100) :
                $deliveryRate->deliveryServiceFee;

            $driver = Driver::find($deliveryOrder->driverId);

            if ($deliveryOrder->deliveryFee > 0) {
                $this->balanceRepository->addBalance($driver->balanceId, $deliveryOrder->deliveryFee);
                $this->balanceFlowRepository->insert($deliveryOrder->deliveryFee, BalanceFlowTypeConst::BALANCE_COLLECTED_DELIVERY_RATE, $driver->balanceId);
            }

            if ($deliveryServiceFee > 0) {
                $this->balanceRepository->subBalance($driver->balanceId, $deliveryRate->deliveryServiceFee);
                $this->balanceFlowRepository->insert($deliveryRate->deliveryServiceFee, BalanceFlowTypeConst::BALANCE_SERVICE_RATE_APP, $driver->balanceId);
            }
        }

        if ($deliveryOrder->payMachineReturnId) {
            $driver = Driver::find($deliveryOrder->driverId);

            $payMachineReturn = $this->payMachineReturnRepository->find($deliveryOrder->payMachineReturnId);

            if (!$payMachineReturn->paidByPlatform) {
                return;
            }

            $value = 0;

            switch ($payMachineReturn->payMachineReturnTypeId) {
                case PayMachineReturnConst::FIXED_VALUE :
                    $value = $payMachineReturn->value;
                    break;
                case PayMachineReturnConst::DELIVERY_RATE_PERCENTAGE:
                    if ($deliveryOrder->deliveryFee)
                        $value = $deliveryOrder->deliveryFee * $payMachineReturn->value / 100;
                    break;
            }

            $this->balanceRepository->addBalance($driver->balanceId, $value);
            $this->balanceFlowRepository->insert($value, BalanceFlowTypeConst::BALANCE_PAY_MACHINE_RETURN, $driver->balanceId);
        }
    }

    private function createDeliveryOrderPlace(DeliveryOrder $deliveryOrder, int $placeId)
    {
        $deliveryOrderPlace = new DeliveryOrderPlace;
        $deliveryOrderPlace->placeId = $placeId;
        $deliveryOrderPlace->deliveryOrderId = $deliveryOrder->id;
        $deliveryOrderPlace->save();
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @param array $deliveryOrderItems
     * @return \Illuminate\Support\Collection[DeliveryOrderItem]
     */
    private function deliveryItems(DeliveryOrder $deliveryOrder, array $deliveryOrderItems): Collection
    {
        $deliveryOrderItemsCollect = collect();

        foreach ($deliveryOrderItems as $deliveryItem) {
            $deliveryOrderItem = new DeliveryOrderItem($deliveryItem);
            $deliveryOrderItem->deliveryOrderId = $deliveryOrder->id;
            $deliveryOrderItem->save();

            if (isset($deliveryItem['complements']))
                foreach ($deliveryItem['complements'] as $complement) {
                    $deliveryOrderComplement = new DeliveryOrderComplement($complement);
                    $deliveryOrderComplement->deliveryOrderItemId = $deliveryOrderItem->id;
                    $deliveryOrderComplement->save();
                }

            $deliveryOrderItemsCollect->push($deliveryOrderItem);
        }

        return $deliveryOrderItemsCollect;
    }

    private function calculatePreviewDelivery($averageDeliveryTime)
    {
        $start = Carbon::now();
        $end = Carbon::now();

        $start->setMinute($start->minute + $averageDeliveryTime);
        $end->setMinute($end->minute + $averageDeliveryTime + 15);

        return (object)[
            'start' => $start,
            'end' => $end
        ];
    }

    private function createDeliveryPaymentTransaction(string $id_payment, float $value, string $status, int $deliveryOrderId)
    {
        return DeliveryPaymentTransactions::create([
            'paymentId' => $id_payment,
            'value' => $value,
            'status' => $status,
            'deliveryOrderId' => $deliveryOrderId,
        ]);
    }
}
