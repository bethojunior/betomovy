<?php


class VoucherController extends View
{
    public function actionVoucherList() {
        $this->nameView = "Vouchers";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                'voucher/index'
            ],
            [
                'controllers/VoucherController',
                'modulos/voucher/index'
            ]
        );
    }
}