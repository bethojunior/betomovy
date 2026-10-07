<?php

namespace app\services;

use app\constant\ChatBotTripTypeConst;
use app\dao\ChatBotDao;
use app\dao\ChatTripDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 09/04/2019
 * Time: 11:27
 */
class ChatBotTripService
{
    private $chatBotDao;
    private $chatTripDao;

    public function __construct()
    {
        $this->chatBotDao = new ChatBotDao;
        $this->chatTripDao = new ChatTripDao;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function sendMessage($request)
    {
        $chatBot = $this->chatBotDao
            ->getMessageRandom(
                $request->chatBotTripTypeId ?? ChatBotTripTypeConst::NORMAL_TRIP
            );

        $request->message = $chatBot->message;

        return $this->chatTripDao
            ->sendMessage($request);
    }
}