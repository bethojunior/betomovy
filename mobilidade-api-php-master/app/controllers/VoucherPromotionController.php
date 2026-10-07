<?php


namespace app\controllers;
use app\services\VoucherPromotionService;
use Exception;

class VoucherPromotionController extends ApiController
{
    public function actionFindAll()
    {
        try {
            if (!(isset($this->requestQuery()->latitude) && isset($this->requestQuery()->longitude))) throw new Exception("Localização não enviada!");

            echo $this->returnSuccess("Vouchers Ativos",
                (new VoucherPromotionService())->findAll($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}