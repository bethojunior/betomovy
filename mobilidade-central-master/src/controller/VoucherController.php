<?php

class VoucherController extends View
{
    public function actionList(){
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'voucher/index',
                'preload/index',
            ],
            [
                'repositories/CentralRepository',
                'repositories/VoucherRepository',
                'controllers/VoucherController',
                'controllers/CentralVoucherPurchasePaymentController',
                'modules/voucher/index'
            ],
            [
                'voucher/index',
                'preload/index',
            ]
        );
    }
}