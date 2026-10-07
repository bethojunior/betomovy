<?php

namespace app\model;
/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 09/09/2018
 * Time: 10:36
 */
class DriverRegisterStatus
{
    const ATIVO = 1;
    const PENDENTE = 2;
    const BLOQUEADO = 3;
    const AGUARDANDO_RESPOSTA = 4;
    const BLACKLIST = 5;
}