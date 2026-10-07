<?php

namespace app\controllers;
use app\services\ChatBotTripService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 09/04/2019
 * Time: 11:17
 */
class ChatBotTripController extends ApiController
{
    public function actionSendMessage()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Mensagem enviada",
                (new ChatBotTripService)->sendMessage($request));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}