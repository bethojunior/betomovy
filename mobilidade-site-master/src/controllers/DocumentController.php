<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 24/10/2018
 * Time: 13:54
 */

class DocumentController extends View
{
    public function actionReceipt(){
        $this->layoutBuilder(
            [
                "receipt/transfer"
            ],
            [
                "controllers/WithdrawController",
                "service/MaskService",
                "service/CodeSecurity",
                "service/DateCustom",
                "modulos/receipt/transfer"
            ],
            [
                'receipt-transfer'
            ]
        );
    }
}