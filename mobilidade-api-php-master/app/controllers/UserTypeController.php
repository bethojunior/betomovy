<?php

namespace app\controllers;
use app\services\UserTypeService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 26/08/2019
 * Time: 11:35
 */
class UserTypeController extends ApiController
{

    public function actionDrivers()
    {
        try {
            echo $this->returnSuccess("Tipos de motoristas ativos",
                (new UserTypeService())->getTypeDrivers()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDriversByAppPartners() 
    {
        try {
            $keyAppPartner = $_GET['app_partner'];
            echo $this->returnSuccess("Tipos de motoristas ativos",
                (new UserTypeService())->getDriversByAppPartner($keyAppPartner)
            );
        } catch (Exception $error) {
            echo $this->returnError($error);
        }
    }
    public function actionGetMessageTripCanceled()
    {
        try {
            $tripReference = $_GET['tripReference'];
            $message = (new UserTypeService())->getMessageTripCanceled($tripReference);
            echo $this->onlyReturn($message);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

}