<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/08/2020
 * Time: 15:46
 */

namespace Api\Services\Order;


use Api\Repositories\Order\DeliveryOrderMessageRepository;
use App\Models\Company\CompanyWorker;
use Common\Models\Order\DeliveryOrder;
use Common\Models\Order\DeliveryOrderMessage;
use Common\Realtimes\Order\MessageRealtime;

class DeliveryOrderMessageService
{
    /**
     * @var DeliveryOrderMessageRepository
     */
    private $repository;
    /**
     * @var MessageRealtime
     */
    private $messageRealtime;

    public function __construct(DeliveryOrderMessageRepository $repository,
                                MessageRealtime $messageRealtime)
    {
        $this->repository = $repository;
        $this->messageRealtime = $messageRealtime;
    }

    public function sendMessage(DeliveryOrder $deliveryOrder, array $request): DeliveryOrderMessage
    {
        /** @var CompanyWorker $companyWorker */
        $companyWorker = auth()->user()->companyWorker;

        $deliveryOrderMessage = new DeliveryOrderMessage([
            'deliveryOrderId' => $deliveryOrder->id,
            'companyId' => $companyWorker->companyId,
            'companyWorkerId' => $companyWorker->id,
            'message' => $request['message'],
            'type' => 'company'
        ]);
        $deliveryOrderMessage->save();

        $this->messageRealtime
            ->insert($deliveryOrderMessage->toArray());

        return $deliveryOrderMessage;
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findMessages(DeliveryOrder $deliveryOrder)
    {
        return $this->repository
            ->findByDeliveryOrder($deliveryOrder->id);
    }
}
