<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 08/05/2019
 * Time: 17:14
 */

class PartnerController extends View
{
    public function actionListPartner()
    {
        $this->nameView = "Listagem de parceiros";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "partner/listPartner"
            ],
            [
                "controllers/PartnerController",
                "controllers/PartnerCommissionController",
                "modulos/partner/listPartner"
            ],
            [
                "partner/partnerList"
            ]);
    }

    public function actionMessagePartner()
    {
        $this->nameView = "Mensagens da ouvidoria";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "partner/messagePartner"
            ],
            [
                "controllers/PartnerController",
                "modulos/partner/messagePartner"
            ],
            [
                "partner/messagePartner"
            ]);
    }
}