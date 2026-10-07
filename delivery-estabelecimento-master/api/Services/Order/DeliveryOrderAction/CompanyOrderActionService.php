<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/06/2020
 * Time: 09:22
 */

namespace Api\Services\Order\DeliveryOrderAction;


use Api\Repositories\Order\DeliveryOrderAction\CompanyOrderActionRepository;
use Api\Repositories\Order\DeliveryOrderRepository;
use App\Repositories\User\DriverRepository;
use Common\Constants\DeliveryOrderConstant;
use Common\Constants\DeliveryOrderStatusConstant;
use Common\Constants\PaymentFormTypeConst;
use Common\Exceptions\Utils\PushException;
use Common\Helpers\Config\PushConfigHelper;
use Common\Models\Driver\DriverCalled;
use Common\Models\Order\DeliveryOrder;
use Common\Models\Order\DeliveryPaymentTransactions;
use Common\Realtimes\Order\OrderRealtime;
use Common\Repositories\DriversCloseDeliveryOrderRepository;
use Common\Repositories\Acquirer\AcquirerRepository;
use Common\Repositories\Acquirer\AcquirerMetaDataRepository;
use Common\Utils\AsaasApi;
use Common\Utils\Checkout704Pay;
use Common\Utils\Push;
use App\Constants\Acquirer\AcquirerConst;
use ExponentPhpSDK\Exceptions\ExpoException;
use ExponentPhpSDK\Exceptions\UnexpectedResponseException;
use Illuminate\Support\Facades\Log;

class CompanyOrderActionService
{
    /**
     * @var DeliveryOrderRepository
     */
    private $deliveryOrderRepository;
    /**
     * @var DriversCloseDeliveryOrderRepository
     */
    private $driversCloseDeliveryOrderRepository;
    /**
     * @var Push
     */
    private $push;
    /**
     * @var PushConfigHelper
     */
    private $pushConfigHelper;
    /**
     * @var DriverRepository
     */
    private $driverRepository;
    /**
     * @var Checkout
     */
    private $checkout;
    /**
     * @var Acquirer
     */
    private $acquirerRepository;
    /**
     * @var AcquirerMetaData
     */
    private $acquirerMetaDataRepository;



    public function __construct(DeliveryOrderRepository $deliveryOrderRepository,
                                DriversCloseDeliveryOrderRepository $driversCloseDeliveryOrderRepository,
                                PushConfigHelper $pushConfigHelper,
                                DriverRepository $driverRepository,
                                AcquirerMetaDataRepository $acquirerMetaDataRepository,
                                AcquirerRepository $acquirerRepository,
                                Push $push)
    {
        $this->deliveryOrderRepository = $deliveryOrderRepository;
        $this->driversCloseDeliveryOrderRepository = $driversCloseDeliveryOrderRepository;
        $this->push = $push;
        $this->pushConfigHelper = $pushConfigHelper;
        $this->driverRepository = $driverRepository;
        $this->acquirerMetaDataRepository = $acquirerMetaDataRepository;
        $this->acquirerRepository = $acquirerRepository;
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @return DeliveryOrder
     * @throws \Throwable
     */
    public function confirm(DeliveryOrder $deliveryOrder)
    {
        try {
            \DB::beginTransaction();

            $deliveryOrderFully =
                $this->updateStatus($deliveryOrder, DeliveryOrderStatusConstant::CONFIRMED);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        $this->sendPush($deliveryOrderFully);

        return $deliveryOrderFully;
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @return DeliveryOrder
     * @throws \Throwable
     */
    public function refuse(DeliveryOrder $deliveryOrder): DeliveryOrder
    {
        try {
            \DB::beginTransaction();

            if ($deliveryOrder->deliveryPaymentForm->paymentFormTypeId == PaymentFormTypeConst::CREDIT_CARD) {
                $deliveryPaymentTransactions = DeliveryPaymentTransactions::query()->where('deliveryOrderId', $deliveryOrder->id)->first();

                $this->checkout = $this->getCheckout();
                $response = $this->checkout->cancelCharge($deliveryPaymentTransactions->paymentId, $deliveryPaymentTransactions->value);
                if ((is_array($response) && $response["status"]) || (is_object($response) && $response->status)) {
                    $deliveryPaymentTransactions->status = 'REFUNDED';
                    $deliveryPaymentTransactions->save();
                }
            }

            $deliveryOrderFully =
                $this->updateStatus($deliveryOrder, DeliveryOrderStatusConstant::REFUSED);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        $this->sendPush($deliveryOrderFully);

        return $deliveryOrderFully;
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @return DeliveryOrder
     * @throws \Throwable
     */
    public function prepare(DeliveryOrder $deliveryOrder)
    {
        try {
            \DB::beginTransaction();

            $deliveryOrderFully =
                $this->updateStatus($deliveryOrder, DeliveryOrderStatusConstant::IN_PREPARATION);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        $this->sendPush($deliveryOrderFully);
        $this->sendVerificationCode($deliveryOrderFully);

        return $deliveryOrderFully;
    }


    /**
     * @param DeliveryOrder $deliveryOrder
     * @return DeliveryOrder
     * @throws \Throwable
     */
    public function withdrawInLocal(DeliveryOrder $deliveryOrder)
    {
        try {
            \DB::beginTransaction();

            $deliveryOrderFully =
                $this->updateStatus($deliveryOrder, DeliveryOrderStatusConstant::WITHDRAW_IN_LOCAL);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        $this->sendPush($deliveryOrderFully);

        return $deliveryOrderFully;
    }


    public function searchDeliveryMan(DeliveryOrder $deliveryOrder)
    {
        try {
            \DB::beginTransaction();

            $deliveryOrderFully =
                $this->updateStatus($deliveryOrder, DeliveryOrderStatusConstant::SEARCH_DELIVERY_MAN);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        artisanBackgroundTask('order:call ' . $deliveryOrder->id);

        $this->sendPush($deliveryOrderFully);

        return $deliveryOrderFully;
    }

    public function cancel(DeliveryOrder $deliveryOrder)
    {

        if(!is_null($deliveryOrder->driver)) {
            $push = new Push();
            $push->setTitle("Cancelamento de entregar do pedido");
            $push->setBody("O estabelecimento cancelou a entrega do pedido");
            $push->sendNotification($deliveryOrder->driver->user->deviceToken);
        }

        if ($deliveryOrder->deliveryPaymentForm->paymentFormTypeId == PaymentFormTypeConst::CREDIT_CARD) {
            $deliveryPaymentTransactions = DeliveryPaymentTransactions::query()->where('deliveryOrderId', $deliveryOrder->id)->first();

            $this->checkout = $this->getCheckout();
            $response = $this->checkout->cancelCharge($deliveryPaymentTransactions->paymentId, $deliveryPaymentTransactions->value);

            if ((is_array($response) && $response["status"]) || (is_object($response) && $response->status)) {
                $deliveryPaymentTransactions->status = 'REFUNDED';
                $deliveryPaymentTransactions->save();
            }
        }


        $deliveryOrder->deliveryOrderStatusId = DeliveryOrderStatusConstant::CANCELED;
        $deliveryOrder->canceledBy = DeliveryOrderConstant::CANCELED_BY_COMPANY;
        $deliveryOrder->finished_at = now();
        $deliveryOrder->save();

        /** @var DeliveryOrder $deliveryOrderFully */
        $deliveryOrderFully = $this->deliveryOrderRepository
            ->findFully($deliveryOrder->id);

        $orderRealtime = new OrderRealtime;
        $orderRealtime->update([
            'id' => $deliveryOrder->id
        ], $deliveryOrderFully->toArray());

        $this->sendPush($deliveryOrderFully);

        return $deliveryOrder;
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @param int $deliveryOrderStatusId
     * @return DeliveryOrder
     */
    private function updateStatus(DeliveryOrder $deliveryOrder, int $deliveryOrderStatusId): DeliveryOrder
    {
        $deliveryOrder->deliveryOrderStatusId = $deliveryOrderStatusId;
        $deliveryOrder->save();

        /** @var DeliveryOrder $deliveryOrderFully */
        $deliveryOrderFully = $this->deliveryOrderRepository
            ->findFully($deliveryOrder->id);

        $orderRealtime = new OrderRealtime;
        $orderRealtime
            ->update([
                'id' => $deliveryOrder->id
            ], $deliveryOrderFully->toArray());

        return $deliveryOrderFully;
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     */
    private function callDrivers(DeliveryOrder $deliveryOrder)
    {
        $drivers = $this->driversCloseDeliveryOrderRepository
            ->findDriversClose($deliveryOrder);

        $drivers->map(function ($driverClose) {
            return DriverCalled::create([
                'driverId' => $driverClose->idDriver,
                'deliveryOrderId' => $driverClose->id,
                'proximity' => $driverClose->proximity
            ]);
        });
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     */
    private function sendPush(DeliveryOrder $deliveryOrder)
    {
        try {
            $channelName = "new_order";
            $expo = \ExponentPhpSDK\Expo::normalSetup();
            $expo->subscribe($channelName, $deliveryOrder->user->deviceToken);
            $notification = ['body' => $deliveryOrder->deliveryOrderStatus->description];

            $expo->notify([$channelName], $notification);
        } catch (\Throwable $e) {
            Log::notice($e->getMessage(), $e->getTrace());
        }
    }

    private function sendVerificationCode(DeliveryOrder $deliveryOrder){
        if(is_null($deliveryOrder->verificationCode)) {
            return;
        }

        try {
            $channelName = "new_order";
            $expo = \ExponentPhpSDK\Expo::normalSetup();
            $expo->subscribe($channelName, $deliveryOrder->user->deviceToken);
            $notification = ['body' => "Para sua segurança, seu código de entrega: ".$deliveryOrder->verificationCode];

            $expo->notify([$channelName], $notification);
        } catch (\Throwable $e) {
            Log::notice($e->getMessage(), $e->getTrace());
        }
    }

    /**
     * @throws \Common\Exceptions\Utils\PushException
     */
    public function goOutForDelivery(DeliveryOrder $deliveryOrder, $driverId)
    {
        $deliveryOrder->driverId = $driverId;

        try {
            \DB::beginTransaction();

            $deliveryOrderFully =
                $this->updateStatus($deliveryOrder, DeliveryOrderStatusConstant::OUT_FOR_DELIVERY);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        try {
            $this->openDriverApp($driverId);
            $this->sendPush($deliveryOrderFully);
        } catch (\Throwable $e) {
            Log::notice($e);
        }

        return $deliveryOrderFully;
    }


    public function goOutForDeliveryManual(DeliveryOrder $deliveryOrder)
    {
        try {
            \DB::beginTransaction();

            $deliveryOrderFully =
                $this->updateStatus($deliveryOrder, DeliveryOrderStatusConstant::OUT_FOR_DELIVERY);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        $this->sendPush($deliveryOrderFully);

        return $deliveryOrderFully;
    }


    public function finish(DeliveryOrder $deliveryOrder)
    {
        return $this->updateStatus($deliveryOrder, DeliveryOrderStatusConstant::FINISHED);
    }

    /**
     * @throws \Common\Exceptions\Utils\PushException
     */
    private function openDriverApp(int $driverId)
    {
        $pushConfig = $this->pushConfigHelper
            ->get('call_driver');

        $driver = $this->driverRepository
            ->findWithUser($driverId);

        $this->push
            ->setTitle($pushConfig['title'])
            ->setBody($pushConfig['message'])
            ->setAction($pushConfig['action'])
            ->setTag($pushConfig['tag'])
            ->setForceStart($pushConfig['forceStart'])
            ->setPriority($pushConfig['priority'])
            ->setIcon($pushConfig['icon'])
            ->setSoundname($pushConfig['soundName'])
            ->sendNotificationWithData($driver->user->deviceToken);
    }

    private function getCheckout()
    {
        $acquirerId = $this->acquirerRepository->getFinancialIntermediaryActive();
        switch ($acquirerId[0]['id']) {
            case AcquirerConst::ASAAS:
                $acquirerData = $this->acquirerMetaDataRepository->getAcquirer($acquirerId[0]['id']);
                return  new AsaasApi(
                    $acquirerData[0]["value"]);
            case AcquirerConst::PAY704:
                $acquirerData = $this->acquirerMetaDataRepository->getAcquirer($acquirerId[0]['id']);
                return  new Checkout704Pay(
                    $acquirerData[0]["value"],
                    $acquirerData[1]["value"]);
            default:
               throw new \Exception('O aplicativo no momento está com problemas com pagamento via cartão, por favor, tente outro meio de pagamento.');

        }
    }
}
