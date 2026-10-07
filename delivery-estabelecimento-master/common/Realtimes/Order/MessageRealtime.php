<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/08/2020
 * Time: 17:12
 */

namespace Common\Realtimes\Order;


use Common\Contracts\Repository\RethinkRepository;

class MessageRealtime extends RethinkRepository
{

    /**
     * RethinkRepository constructor.
     * Esse método deve alimentar o atributo $table com o nome da tabela
     */
    public function __construct()
    {
        $this->table = 'messages';
    }
}
