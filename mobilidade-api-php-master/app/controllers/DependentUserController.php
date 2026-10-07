<?php

namespace app\controllers;

use app\services\DependentUserService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/12/2019
 * Time: 10:42
 */
class DependentUserController extends ApiController
{
    public function actionInsert()
    {
        try {
            $result = (new DependentUserService)
                ->insert($this->request(false), Headers::getUserId());

            echo $this->returnSuccess("Dependente inserido com sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindByResponsible()
    {
        try {
            $result = (new DependentUserService)
                ->findByResponsible(Headers::getUserId());

            echo $this->returnSuccess("Dependentes encontrados com sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar dependentes");
        }
    }

    public function actionDelete()
    {
        try {
            $result = (new DependentUserService)
                ->delete($this->request(false));

            echo $this->returnSuccess("Dependente excluído com sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao excluir dependente");
        }
    }
}