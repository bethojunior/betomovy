<?php

namespace app\controllers;
use app\services\AddressBlacklistService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/06/2020
 * Time: 09:47
 */
class AddressBlacklistController extends ApiController
{
    public function actionInsert()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess(
                "Endereço salvo na blacklist",
                (new AddressBlacklistService)->insert($request));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao salvar endereço na blacklist", 400);
        }
    }
}