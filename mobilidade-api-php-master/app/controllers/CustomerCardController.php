<?php

namespace app\controllers;

use app\services\CustomerCardService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/11/2018
 * Time: 15:52
 */
class CustomerCardController extends ApiController
{
    public function actionInsert()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Cartão inserido",
                (new CustomerCardService)->insert($request, Headers::getUserId())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionAcquirer()
    {
        try {
            echo $this->returnSuccess("Adquirente retornado com sucesso.",
                (new CustomerCardService)->getAcquirer()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGet()
    {
        $cardId = $_GET['cardId'] ?? null;

        try {
            echo $this->returnSuccess("Cartões encontrados",
                (new CustomerCardService)
                    ->get($cardId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar cartões");
        }
    }


    public function actionDelete()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Cartão excluído",
                (new CustomerCardService)
                    ->delete($request->cardId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao excluir o cartão");
        }
    }
}