<?php

namespace app\controllers;
use app\services\FavoriteDriverService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 12/12/2018
 * Time: 17:39
 */
class FavoriteDriverController extends ApiController
{
    public function actionInsert()
    {
        $request = $this->request(false);
        try {
            echo $this->returnSuccess("Motorista adicionando na lista de favoritos",
                (new FavoriteDriverService)
                    ->insert($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionList()
    {
        $request = $this->request(false);

        try {
            echo $this->returnSuccess("Motoristas favoritos encontrados",
                (new FavoriteDriverService)
                    ->list($request->customerId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar motoristas encontrados");
        }
    }

    public function actionDelete()
    {
        $request = $this->request(false);

        try {
            echo $this->returnSuccess("Motorista favorito removido",
                (new FavoriteDriverService)
                    ->delete($request->idFavorite)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao remover motorista favorito");
        }
    }

    public function actionListCustomers()
    {
        try {
            $request = $this->request(false);
            echo $this->returnSuccess("Passageiros encontrados",
                (new FavoriteDriverService)
                    ->listByDriver($request->driverId, $request->page ?? null)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}