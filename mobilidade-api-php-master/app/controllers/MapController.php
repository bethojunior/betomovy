<?php


namespace app\controllers;
use app\services\MapService;
use Exception;

class MapController extends ApiController
{
    public function actionCheckServices()
    {
        try {
            $result = (new MapService)
                ->checkService();
            echo $this->returnSuccess("Serviços de mapa atual", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionListPriorityService()
    {
        try {
            $result = (new MapService)
                ->listPriority();
            echo $this->returnSuccess("Lista de prioridades", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionServiceTest()
    {
        try {
            $result = (new MapService)
                ->serviceTest($this->request(false));
            echo $this->returnSuccess("Resultado do teste de serviço", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionAllServiceTest()
    {
        try {
            $result = (new MapService)->serviceAllTest();
            echo $this->returnSuccess("Resultado do teste de serviço", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}