<?php

namespace app\controllers;
use app\services\FormStepUserTypeService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/01/2020
 * Time: 16:07
 */
class FormStepController extends ApiController
{
    public function actionGetByUserType()
    {
        try {
            $result = (new FormStepUserTypeService)
                ->findByUserType($this->requestQuery());

            echo $this->returnSuccess("Campos encontrados", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}