<?php

namespace app\controllers;
use app\services\RefusedCustomerService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/03/2019
 * Time: 13:50
 */
class RefusedCustomerController extends ApiController
{
    public function actionInsert()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Cliente recusado para as próximas viagens",
                (new RefusedCustomerService)
                    ->insert($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionList()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Clientes recusados encontrados",
                (new RefusedCustomerService)
                    ->list($request->driverId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar clientes recusados");
        }
    }

    public function actionDelete()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess(
                "Cliente recusado removido, agora pode receber chamados desse cliente",
                (new RefusedCustomerService)
                    ->delete($request->idRefused)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao remover cliente recusado");
        }
    }
}