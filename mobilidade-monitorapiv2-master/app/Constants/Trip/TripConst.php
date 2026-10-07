<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 16:20
 */

namespace App\Constants\Trip;


class TripConst
{
    const CANCELED_BY_CUSTOMER = 'customer';
    const CANCELED_BY_DRIVER = 'driver';
    const CANCELED_BY_ADMIN = 'admin';

    /**
     * OFF STATUSES
     */
    const CANCELED = 'canceled';
    const NOT_ANSWERED = 'not_answered';
    const FINISHED = 'finished';
    const BACK_OFF = 'back_off';
    const PAYMENT_REFUSED = 'payment_refused';

    /**
     * ACTIVES STATUSES
     */
    const PRE_ACCEPTED = 'pre_accepted';
    const ACCEPTED = 'accepted';
    const SCHEDULED = 'scheduled';
    const BOARDING = "boarding";
    const IN_PROGRESS = 'in_progress';

    const ACTIVE_STATUSES = [
        'accepted',
        'pre_accepted',
        'in_progress',
        'boarding',
    ];

    const OFF_STATUSES = [
        'canceled',
        'payment_refused',
        'finished',
        'back_off',
        'not_answered'
    ];

    const STATUSES = [
        'canceled',
        'not_answered',
        'finished',
        'back_off',
        'payment_refused',
        'in_progress',
        'accepted',
        'pre_accepted',
        'searching',
        'searching_favorite',
        'boarding',
    ];

    const SEARCHING_STATUSES = [
        'searching',
        'searching_favorite',
    ];

    const STATUSES_TRANSLATED_FOR_SELECT = [
        ['id' => 'canceled', 'text' => 'Cancelada'],
        ['id' => 'not_answered', 'text' => 'Não Atendida'],
        ['id' => 'finished', 'text' => 'Finalizada'],
        ['id' => 'back_off', 'text' => 'Desistente'],
        ['id' => 'payment_refused', 'text' => 'Pagamento Recusado'],
        ['id' => 'in_progress', 'text' => 'Em Andamento'],
        ['id' => 'accepted', 'text' => 'Aceita'],
        ['id' => 'pre_accepted', 'text' => 'Pré-aceita'],
        ['id' => 'searching', 'text' => 'Buscando motorista'],
        ['id' => 'searching_favorite', 'text' => 'Buscando motorista Favorito'],
        ['id' => 'boarding', 'text' => 'Embarcando'],
    ];

    public static function translateStatus(string $status): ?string
    {
        switch ($status) {
            case 'searching':
                return "Buscando motorista";
            case 'searching_favorite':
                return "Buscando motorista favorito";
            case 'canceled':
                return "Cancelada";
            case 'not_answered':
                return "Não Atendida";
            case 'finished':
                return "Finalizada";
            case 'back_off':
                return "Desistente";
            case 'payment_refused':
                return "Pagamento Recusado";
            case 'in_progress':
                return "Em Andamento";
            case 'accepted':
                return "Aceita";
            case 'pre_accepted':
                return "Pré-aceita";
            case 'boarding':
                return "Embarcando";
            default:
                return null;
        }
    }

    /**
     * @param string $canceledBy
     * @return string|null
     */
    public static function translateCanceledBy(?string $canceledBy): ?string
    {
        if ($canceledBy === 'customer') {
            return "Passageiro";
        }
        if ($canceledBy === 'driver') {
            return "Motorista";
        }

        return null;
    }
}
