<?php

namespace app\controllers;

use app\dao\ChatTripDao;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 06/08/2018
 * Time: 14:14
 */
class ChatTripController extends ApiController
{
    protected $chatTripDao;

    public function __construct()
    {
        $this->chatTripDao = new ChatTripDao;
    }

    public function actionSendMessage()
    {
        try {
            $request = $this->request();

            echo $this->returnSuccess("Mensagem enviada",
                $this->chatTripDao->sendMessage($request));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionSendMessageAudio()
    {

        try {
            $request = $this->request(false, true);

            $request->chatTrip->audio = $_FILES['audio'] ?? null;

            echo $this->returnSuccess("Mensagem enviada",
                $this->chatTripDao->sendMessage($request->chatTrip));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }


    public function actionGetMessages()
    {
        try {
            $request = $this->request();

            echo $this->returnSuccess("Listando mensagens",
                $this->chatTripDao->getMessagesByTrip($request->tripReference));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}