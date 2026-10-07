<?php


namespace app\controllers;
use app\services\AdsCountService;
use Exception;

class AdsCountController extends ApiController
{
    public function actionInsert()
    {
        try {
            echo $this->returnSuccess("Inserido com sucesso!", (new AdsCountService())->insert($this->request(false)));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir informação da publicidade");
        }
    }
}