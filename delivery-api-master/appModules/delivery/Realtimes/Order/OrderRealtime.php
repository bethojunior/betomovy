<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/06/2020
 * Time: 10:19
 */

namespace Delivery\Realtimes\Order;


use App\Contracts\Repository\RethinkRepository;

class OrderRealtime extends RethinkRepository
{

    /**
     * RethinkRepository constructor.
     * Esse método deve alimentar o atributo $table com o nome da tabela
     */
    public function __construct()
    {
        $this->table = 'orders';
    }
}
