<?php


namespace app\controllers;
use app\services\NotifyService;
use Exception;

class NotifyController extends ApiController
{
    public function actionSendAlertToCustomer()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Notificação enviada",
                (new NotifyService)
                    ->sendAlertToCustomer($request)
            );

        } catch (Exception $exception) {
            echo $this->returnError($exception, "Ocorreu um erro ao enviar alerta para cliente");

        }
    }
}