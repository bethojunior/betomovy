<?php

namespace app\constant;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/12/2018
 * Time: 10:26
 */
class FinancialIntermediaryConst
{
    const MERCADO_PAGO = 1;
    const CIELO = 2;
    const RECEBE_AQUI = 3;
    const IUGU = 4;
    const PAGSEGURO = 5;
    /** Stripe oficial neste projeto (api.movymob.com) */
    const STRIPE = 17;
    /** Alias de STRIPE (id 17). NÃO usar 6 — no banco MOVY id 6 é GETNET. */
    const STRIPE_LEGACY = 17;
    /** Em alguns seeds antigos GETNET=12; no banco MOVY produção o id é 6. */
    const GETNET = 12;
    const GETNET_MOVY = 6;
    const REDE = 7;
    const ZSPAY = 8;
    const PAYSOON = 9;
    const COTABANK = 10;
    const INTEGRAPAY = 11;
    const PAY704 = 13;
    const EPAG = 14;
    const YUMEPAY = 15;
    const FIREBANKING = 16;
}