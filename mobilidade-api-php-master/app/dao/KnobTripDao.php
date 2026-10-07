<?php

namespace app\dao;

use app\exceptions\TripException;
use app\utils\BaseDao;
use app\model\Trip;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/02/2019
 * Time: 15:05
 */
class KnobTripDao extends BaseDao
{
    protected $table = "trip";

    /**
     * @param $data
     * @throws Exception
     */
    public function verifyCustomerInTrip($data): void
    {
        $tripExists = $this->sqlSelect(
            ['tripReference'],
            [
                ['userId', '=', ':userId', 'AND'],
                ['status', '<>', ':finishedStatus', 'AND'],
                ['status', '<>', ':cancelledStatus', 'AND'],
                ['status', '<>', ':notAnswered', 'AND'],
                ['status', '<>', ':paymentRefused', 'AND'],
                ['status', '<>', ':backOff'],
            ]
        )
            ->bind([
                ':userId' => $data->userId,
                ':finishedStatus' => Trip::FINISHED,
                ':cancelledStatus' => Trip::CANCELED,
                ':notAnswered' => Trip::NOT_ANSWERED,
                ':paymentRefused' => Trip::PAYMENT_REFUSED,
                ':backOff' => Trip::BACK_OFF,
            ])
            ->get(false);

        if ($tripExists)
            throw new TripException(200, ['tripReference' => $tripExists->tripReference]);
    }
}