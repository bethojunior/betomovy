<?php

namespace app\commands;

use app\dao\ChatTripDao;
use app\dao\DeliveryInfoDao;
use app\dao\LogDao;
use app\dao\TripDao;
use app\dao\TripItemDao;
use app\utils\Command;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/04/2020
 * Time: 10:47
 */
class SendDeliveryMessageCommand extends Command
{
    /**
     * @var TripDao
     */
    private $tripDao;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->tripDao = new TripDao;
    }

    public function handle(): void
    {
        $tripReference = $this->params[2] ?? '';

        try {
            $trip = $this->tripDao->find($tripReference);

            $tripItem = (new TripItemDao)->findByTripReference($tripReference);
            $deliveryInfo = (new DeliveryInfoDao)->findByTripReference($tripReference);

            $mountedMessage = "<b># DETALHES DA ENTREGA</b><br/><br/>";
            $mountedMessage .= "<b>Tipo de entrega:</b> {$tripItem->tripItemType}<br/><br/>";

            $mountedMessage .= "<b>Coleta:</b><br/>";
            $mountedMessage .= ($deliveryInfo->obsOrigin ?? '') . "<br/><br/>";

            $mountedMessage .= "<b>Entrega:</b><br/>";

            foreach ($trip->tripWayPoints as $wayPoint) {
                $mountedMessage .=
                    "<b>{$wayPoint->address}:</b> " . ($wayPoint->obs ?? '') . "<br/>";
            }

            $mountedMessage .= "<b>{$trip->destination->name}:</b><br/>";
            $mountedMessage .= ($deliveryInfo->obsDestination ?? '') . "<br/>";

            if (!empty($deliveryInfo->obs)) {
                $mountedMessage .= "<br/><b>Observações:</b> {$deliveryInfo->obs}<br/>";
            }

            (new ChatTripDao)->sendMessage((object)[
                'userId' => $trip->userId,
                'tripReference' => $trip->tripReference,
                'message' => $mountedMessage
            ]);

        } catch (Exception $e) {
            (new LogDao)->logException($e);
        }
    }
}