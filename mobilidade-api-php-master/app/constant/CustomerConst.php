<?php

namespace app\constant;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/11/2018
 * Time: 15:24
 */
class CustomerConst
{
    const PROFILE_IMAGE_DIR = "customer/profile/";
    const DOC_IMAGE_DIR = "customer/doc/";
    const CONFIRMATION_CODE = "Seu codigo de confirmacao eh: ";

    const DEFAULT_IMAGE_NAME = 'user.png';

    const PUSH_TITLE_ON_CANCEL_TRIP = "VIAGEM CANCELADA PELO CLIENTE";
    const PUSH_BODY_ON_CANCEL_TRIP = "O Cliente efetuou o cancelamento da viagem";

    const REGISTERED_IN_MOBILITY = 'mobilidade';
    const REGISTERED_IN_DELIVERY = 'delivery';
}