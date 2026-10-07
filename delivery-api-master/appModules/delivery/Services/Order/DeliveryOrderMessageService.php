<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/08/2020
 * Time: 17:23
 */

namespace Delivery\Services\Order;


use App\Models\User;
use App\Utils\Push;
use Delivery\Models\Order\DeliveryOrder;
use Delivery\Models\Order\DeliveryOrderMessage;
use Delivery\Realtimes\Order\MessageRealtime;
use Delivery\Repositories\Driver\DriverRepository;
use Delivery\Repositories\Order\DeliveryOrderMessageRepository;

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

    /**
     * @var DeliveryOrderService
     */
    private $deliveryOrderService;

    public function __construct(DeliveryOrderMessageRepository $repository,
                                MessageRealtime $messageRealtime,
                                DeliveryOrderService $deliveryOrderService)
    {
        $this->repository = $repository;
        $this->messageRealtime = $messageRealtime;
        $this->deliveryOrderService = $deliveryOrderService;
    }

    public function findMessages(DeliveryOrder $deliveryOrder, array  $request)
    {
        if(!isset($request['type']))
            throw new \Exception("Informe o tipo de chat");
        return $this->repository
            ->findByDeliveryOrder($deliveryOrder->id, $request['type']);
    }

    public function send(DeliveryOrder $deliveryOrder, array $request, User $user): DeliveryOrderMessage
    {
        $driver = (new DriverRepository())->findByUser($user->idUser);

        if(!$driver && !$request['sendTo']) throw new \Exception("O parâmetro sendTo é obrigatório");

        $deliveryOrderMessage = new DeliveryOrderMessage([
            'deliveryOrderId' => $deliveryOrder->id,
            'userId' => $driver ? null : $user->idUser,
            'driverId' => $driver->idDriver ?? null,
            'message' => $request['message'],
            'type' =>  $request['sendTo']
        ]);


        $deliveryOrderMessage->save();

        $object = $deliveryOrderMessage->toArray();

        $object['companyId'] = $deliveryOrder->companyId;

        $this->messageRealtime
            ->insert($object);



        $message = "Nova mensagem de $user->name";

        if($deliveryOrderMessage->type != "driver") {
            $this->deliveryOrderService->notifyCompany($message, $deliveryOrder->companyId);
        } else {
            $push = new Push();
            $push
                ->setMessage($message)
                ->setDeviceToken($deliveryOrder->driver->user->deviceToken);

            $push->sendNotificationWithData();
        }

        return $deliveryOrderMessage;
    }
}
