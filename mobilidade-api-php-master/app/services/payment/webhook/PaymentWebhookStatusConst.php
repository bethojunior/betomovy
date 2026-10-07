<?php

namespace app\services\payment\webhook;

class PaymentWebhookStatusConst
{
    const SUCCESS = 'Sucesso';
    const PENDING = 'Pendente';
    const CANCELED = 'Cancelado';
    const REFUNDED = 'Estornado';
    const REFUSED = 'Recusado';
}