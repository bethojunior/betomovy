<?php

namespace app\controllers;
use app\services\PreRegisterDriverMkService;
use app\model\Config;
use app\model\ConfigType;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/01/2019
 * Time: 14:18
 */
class MarketingController extends ApiController
{
    public function actionPreRegisterDriver()
    {
        try {
            $request = $this->request(false);

            $preRegister = (new PreRegisterDriverMkService)
                ->insertDriver($request);

            echo $this->returnSuccess("Motorista pré-cadastrado com sucesso", $preRegister->toStdClass());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetAll()
    {
        try {
            $preRegister = (new PreRegisterDriverMkService)
                ->getListDriver();

            echo $this->returnSuccess("Lista de todos os motoristas", $preRegister);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionPromotionalImageCustomerRegister()
    {
        try {
            $config = Config::get(
                'promotional_image_customer_register',
                ConfigType::CUSTOMER,
            );

            echo $this->returnSuccess("Imagem encontrada", $config);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}