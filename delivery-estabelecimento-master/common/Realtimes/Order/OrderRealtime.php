<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/06/2020
 * Time: 11:46
 */

namespace Common\Realtimes\Order;


use Common\Contracts\Repository\RethinkRepository;

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
