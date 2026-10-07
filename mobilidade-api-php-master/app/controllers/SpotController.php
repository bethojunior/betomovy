<?php

namespace app\controllers;
use app\dao\SpotDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/09/2018
 * Time: 17:06
 */
class SpotController extends ApiController
{
    public function actionInsertIndication()
    {
        try {
            echo $this->returnSuccess("Mancha inserida com sucesso",
                (new SpotDao)->insertIndication($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetByEstablishment()
    {
        $request = $this->request();

        try {
            echo $this->returnSuccess("Estatísticas do estabelecimento encontradas",
                (new SpotDao)->getByEstablishment($request->establishmentId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}