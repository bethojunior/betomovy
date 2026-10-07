<?php

namespace app\commands;

use app\dao\LogDao;
use app\dao\TripDao;
use app\utils\Command;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/05/2020
 * Time: 08:24
 */
class SendRideMessageCommand extends Command
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

//            (new ChatTripDao)->sendMessage((object)[
//                'userId' => $trip->userId,
//                'tripReference' => $trip->tripReference,
//                'message' => $mountedMessage
//            ]);

        } catch (Exception $e) {
            (new LogDao)->logException($e);
        }
    }
}