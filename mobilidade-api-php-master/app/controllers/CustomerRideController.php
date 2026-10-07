<?php

namespace app\controllers;

use app\services\CancelRideService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2020
 * Time: 11:04
 */
class CustomerRideController extends ApiController
{
    public function actionFind()
    {
        try {
            $result = (new CustomerRideService)
                ->find($this->requestQuery());

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindActives()
    {
        try {
            $result = (new CustomerRideService)
                ->findActives(Headers::getUserId());

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindByUser()
    {
        try {
            $result = (new CustomerRideService)
                ->findByUserId(Headers::getUserId());

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRequest()
    {
        try {
            $result = (new CustomerRideService)
                ->requestRide(Headers::getUserId(), $this->request(false));

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCancel()
    {
        try {
            $result = (new CancelRideService)
                ->byCustomer(Headers::getUserId(), $this->request(false));

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}