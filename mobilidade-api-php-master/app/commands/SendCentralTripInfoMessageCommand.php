<?php

namespace app\commands;

use app\dao\CentralTripInfoDao;
use app\dao\ChatTripDao;
use app\dao\LogDao;
use app\dao\TripDao;
use app\utils\Command;
use Exception;

class SendCentralTripInfoMessageCommand extends Command
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

            $centralTripInfos = (new CentralTripInfoDao)->findByTripReference($tripReference);

            if (!empty($centralTripInfos) && count($centralTripInfos) > 0) {
                $mountedMessage = "<b># INFORMAÇÕES DA VIAGEM:</b> <br/>";

                foreach ($centralTripInfos as $centralTripInfo) {
                    $mountedMessage .=
                        "<b>{$centralTripInfo->title}:</b> " . ($centralTripInfo->response) . "<br/>";
                }

                (new ChatTripDao)->sendMessage((object)[
                    'userId' => $trip->userId,
                    'tripReference' => $trip->tripReference,
                    'message' => $mountedMessage
                ]);
            }

        } catch (Exception $e) {
            (new LogDao)->logException($e);
        }
    }
}
