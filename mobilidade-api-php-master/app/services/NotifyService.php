<?php


namespace app\services;

use app\utils\PhoneMessage;
use Exception;

class NotifyService
{
    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function sendAlertToCustomer($request)
    {
        if (!isset($request->phone))
            throw new Exception("O parametro phone é obrigatorio");

        $phoneMessage = new PhoneMessage($request->phone, "O seu transporte está a caminho", null, $request->cityId ?? null);

        return $phoneMessage->send();
    }
}