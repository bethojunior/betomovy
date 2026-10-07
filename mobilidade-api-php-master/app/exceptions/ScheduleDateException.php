<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Erros de data/horário no agendamento de viagem.
 * O app usa o código (errors.code) para saber que deve pedir uma nova data.
 */
class ScheduleDateException extends BaseException
{
    const PAST_DATE = 1800;
    const NEAR_TRIP = 1801;

    protected $keyCode = 'schedule-date';
}
