<?php

namespace app\controllers;

use app\services\UserDiscountCouponService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 13:13
 */
class DiscountCouponController extends ApiController
{
    public function actionActivate()
    {
        try {
            $result = (new UserDiscountCouponService)
                ->activate($this->request(false), Headers::getUserId());

            echo $this->returnSuccess("Cupom ativado com sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindActivated()
    {
        try {
            $result = (new UserDiscountCouponService)
                ->findActivatedByUser(Headers::getUserId());

            echo $this->returnSuccess("Cupons encontrados com sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar cupons");
        }
    }
}