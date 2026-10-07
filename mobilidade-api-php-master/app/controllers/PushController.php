<?php

namespace app\controllers;
use Exception;
use app\services\PushTestService;

class PushController extends ApiController
{
    public function actionTest()
    {
        try {
            $body = $this->request(false);

            if (empty($body->userId)) {
                throw new Exception('userId é obrigatório');
            }

            $result = (new PushTestService())->send((int) $body->userId);

            echo $this->returnSuccess('Notificação enviada', $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}