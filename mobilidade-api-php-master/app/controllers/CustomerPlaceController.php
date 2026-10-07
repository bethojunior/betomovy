<?php

namespace app\controllers;
use app\services\CustomerPlaceService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/01/2019
 * Time: 18:09
 */
class CustomerPlaceController extends ApiController
{
    public function actionInsert()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Local inserido com sucesso",
                (new CustomerPlaceService(true))
                    ->insert($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir um local do cliente");
        }
    }

    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Locais salvos encontrados",
                (new CustomerPlaceService(true))
                    ->getAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir um local do cliente");
        }
    }

    public function actionDelete()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Local excluído com sucesso",
                (new CustomerPlaceService(true))
                    ->delete($request->placeId ?? null)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao excluir um local");
        }
    }
}