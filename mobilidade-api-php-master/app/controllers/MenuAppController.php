<?php


namespace app\controllers;
use app\dao\MenuAppDao;
use Exception;

class MenuAppController extends ApiController
{
    public function actionFindByType()
    {
        try {
            echo $this->returnSuccess((new MenuAppDao())->findByType($this->requestQuery()->type));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar MenuApp");
        }
    }
}