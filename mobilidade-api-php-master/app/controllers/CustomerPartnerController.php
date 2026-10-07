<?php

namespace app\controllers;
use app\dao\CustomerPartnerDao;
use app\services\CustomerPartnerService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/10/2018
 * Time: 17:48
 */
class CustomerPartnerController extends ApiController
{
    public function actionRequestBalance()
    {
        try {
            echo $this->returnSuccess("Recarga de Voucher solicitada",
                (new CustomerPartnerService)->sendRequestBalance($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionEditProfile()
    {
        try {
            echo $this->returnSuccess("Perfil atualizado",
                (new CustomerPartnerDao)->editProfile($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionInsertPlace()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Ponto de trabalho inserido",
                (new CustomerPartnerDao)->insertPlace($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckEmail()
    {
        try {
            echo $this->returnSuccess("Email existe",
                (new CustomerPartnerDao)->checkEmail($this->request()->email));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckDocument()
    {
        try {
            echo $this->returnSuccess("Documento existe",
                (new CustomerPartnerDao)
                    ->checkDocument($this->request(false)->document)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}