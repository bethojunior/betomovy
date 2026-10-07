<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/07/2020
 * Time: 08:32
 */

namespace Delivery\Services\Order;


use App\Constants\Delivery\DeliveryOrderStatusConst;
use App\Constants\Driver\DriverCalledConst;
use App\Models\User;
use Delivery\Constants\DeliveryOrder\DeliveryOrderConst;
use Delivery\Constants\DeliveryOrder\PaymentFormTypeConst;
use Delivery\Models\Order\DeliveryOrder;
use Delivery\Models\Order\DeliveryPaymentTransactions;
use Delivery\Realtimes\Order\OrderRealtime;
use Delivery\Repositories\Driver\DriverCalledRepository;
use Delivery\Repositories\Order\DeliveryOrderRepository;
use Delivery\Utils\AsaasApi;
use Delivery\Utils\ConfianceCheckout;

class CancelDeliveryOrderService
{
    /**
     * @var DeliveryOrderRepository
     */
    private $repository;

    private $driverCalledRepository;

    public function __construct(
        DeliveryOrderRepository $repository,
        DriverCalledRepository $driverCalledRepository
    )
    {
        $this->repository = $repository;
        $this->driverCalledRepository = $driverCalledRepository;
    }

    public function cancelByCustomer(DeliveryOrder $deliveryOrder)
    {
        if ($deliveryOrder->deliveryPaymentFormId == PaymentFormTypeConst::CREDIT_CARD) {
            $deliveryPaymentTransactions = DeliveryPaymentTransactions::query()->where('deliveryOrderId', $deliveryOrder->id)->first();

            $response = ConfianceCheckout::refundCreditPayment($deliveryOrder->id);

            if ($response->status) {
                $deliveryPaymentTransactions->status = 'REFUNDED';
                $deliveryPaymentTransactions->save();
            }
        }

        $deliveryOrder->deliveryOrderStatusId = DeliveryOrderStatusConst::CANCELED;
        $deliveryOrder->canceledBy = DeliveryOrderConst::CANCELED_BY_CUSTOMER;
        $deliveryOrder->finished_at = now();
        $deliveryOrder->save();

        $deliveryOrderFully = $this->repository->findFully($deliveryOrder->id);

        $orderRealtime = new OrderRealtime;
        $orderRealtime->update([
            'id' => $deliveryOrder->id
        ], $deliveryOrderFully->toArray());

        return $deliveryOrder;
    }

    public function cancelByDriver(DeliveryOrder $deliveryOrder)
    {
        $this->driverCalledRepository
            ->updateStatusByDriverAndDeliveryOrder(
                $deliveryOrder->driverId, $deliveryOrder->id, DriverCalledConst::REFUSED);

        $deliveryOrder->driverId = null;
        $deliveryOrder->deliveryOrderStatusId = DeliveryOrderStatusConst::SEARCHING_DELIVERY_MAN;
        $deliveryOrder->save();

        $deliveryOrderFully = $this->repository->findFully($deliveryOrder->id);

        $orderRealtime = new OrderRealtime;
        $orderRealtime->update([
            'id' => $deliveryOrder->id
        ], $deliveryOrderFully->toArray());

        artisanBackgroundTask('order:call '.$deliveryOrder->id);

        return $deliveryOrderFully;
    }
}
