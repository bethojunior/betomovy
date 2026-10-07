<?php

namespace app\controllers;
use app\services\RefusedDriverService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/03/2019
 * Time: 17:44
 */
class RefusedDriverController extends ApiController
{
    public function actionInsert()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Motorista recusado para as próximas viagens",
                (new RefusedDriverService)
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

            echo $this->returnSuccess("Motoristas recusados encontrados",
                (new RefusedDriverService)
                    ->list($request->customerId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar motoristas recusados");
        }
    }

    public function actionDelete()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess(
                "Motorista recusado removido, agora esse motorista pode aceitar suas chamadas",
                (new RefusedDriverService)
                    ->delete($request->idRefused)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao remover motorista recusado");
        }
    }

    public function actionFindCustomersBlockedMe(int $idDriver)
    {
        try {
            echo $this->returnSuccess("Clientes que bloquearam o motorista encontrados",
                (new RefusedDriverService)
                    ->listDriversBlockedByCustomer($idDriver)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar clientes que bloquearam o motorista");
        }
    }
}