<?php

namespace app\controllers;
use app\dao\CardDao;
use app\model\Card;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 13/08/2018
 * Time: 10:03
 */
class CardController extends ApiController
{
    protected $cardDao;

    public function __construct()
    {
        $this->cardDao = new CardDao;
    }

    public function actionInsert()
    {
        try {
            echo $this->returnSuccess("Inserido com sucesso",
                $this->cardDao->create($this->request(), Card::class)->toStdClass()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetByEstablishment()
    {
        try {
            echo $this->returnSuccess("Listando cartões do estabelecimento",
                $this->cardDao->getByEstablishment($this->request()->establishmentId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetById()
    {
        try {
            echo $this->returnSuccess("Listando cartão",
                $this->cardDao->find($this->request()->cardId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDelete()
    {
        try {
            echo $this->returnSuccess("Cartão excluído",
                $this->cardDao->delete($this->request()->cardId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}