<?php

namespace app\services;

use app\model\ExternalServiceMetaData;
use app\utils\Email;
use app\model\Config;
// use app\utils\MiltoServiceEmailApi;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/02/2020
 * Time: 09:52
 */
class SiteService
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function sendContactEmail($request)
    {
        $this->validateRequest($request);

        $email =
            Config::get('email_to_send_request_withdraw');

        return Email::sendMail(
            $email,
            'SOLICITAÇÃO DE CONTATO PELO SITE',
            $request->subject,
            "Nome: {$request->name}, <br>Contato: {$request->contact}");
    }

    /**
     * @param $request
     * @throws Exception
     */
    private function validateRequest($request)
    {
        if (!isset($request->name))
            throw new Exception("O campo nome não foi enviada");

        if (!isset($request->contact))
            throw new Exception("O campo contato não foi enviado");

        if (!isset($request->subject))
            throw new Exception("O campo assunto não foi enviado");
    }
}