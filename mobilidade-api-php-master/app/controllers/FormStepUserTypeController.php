<?php

namespace app\controllers;

use app\services\FormStepUserTypeService;
use Exception;

class FormStepUserTypeController extends ApiController
{
    public function actionGetByUserType()
    {
        try {
            $params = $this->requestQuery();
            $userTypeId = isset($params['userTypeId']) ? $params['userTypeId'] : null;
    
            $result = (new FormStepUserTypeService())
                ->findByUserTypeId($userTypeId);
    
            echo $this->returnSuccess("Etapas encontradas", $result);
    
        } catch (Exception $e) {
            echo $this->returnError($e->getMessage());
        }
    }
    
    
}
