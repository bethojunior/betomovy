<?php

namespace app\controllers;
use app\services\VoucherPurchaseService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2018
 * Time: 17:21
 */
class VoucherPurchaseController extends ApiController
{
    public function actionCustomerInsert()
    {
        $request = $this->request(false);

        try {
            echo $this->returnSuccess("Voucher comprado com sucesso",
                (new VoucherPurchaseService)
                    ->insertInCustomer($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao efetuar a compra");
        }
    }

    /**
     * Comprar voucher com PIX
     * @return void
     */
    public function actionPurchaseByPix()
    {
        $request = $this->request(false);
        try {
            echo $this->returnSuccess(
                "Voucher comprado com sucesso por PIX",
                (new VoucherPurchaseService)
                    ->insertInCustomer($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao efetuar a compra de voucher por PIX");
        }
    }

    /**
     * busca dados do voucher
     * @return void
     */
    public function actionShow()
    {
        $request = $this->request(false);
        try {
            echo $this->returnSuccess(
                "Detalhes do voucher",
                (new VoucherPurchaseService)
                    ->getVoucherDetail($request->voucher_id)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao efetuar a compra de voucher por PIX");
        }
    }
}