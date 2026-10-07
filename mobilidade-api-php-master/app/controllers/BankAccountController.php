<?php

namespace app\controllers;
use app\dao\BankAccountDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/09/2018
 * Time: 16:41
 */
class BankAccountController extends ApiController
{
    public function actionInsert()
    {
        try {
            echo $this->returnSuccess("Conta bancaria inserida",
                (new BankAccountDao)->insert($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionEdit()
    {
        try {
            echo $this->returnSuccess("Conta bancária alterada",
                (new BankAccountDao)->edit($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetByUser()
    {
        try {
            $user = $this->request(false);

            echo $this->returnSuccess("Obtendo conta bancária do usuário",
                (new BankAccountDao)->getByUserId($user->userId));

        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}