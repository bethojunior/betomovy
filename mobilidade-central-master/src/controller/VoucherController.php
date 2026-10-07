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
                'repositories/VoucherRepository',
                'controllers/VoucherController',
                'controllers/CentralVoucherPurchasePaymentController',
                'utils/QrCodeGenerator',
                'modules/voucher/index'
            ],
            [
                'voucher/index',
                'preload/index',
            ]
        );
    }
}