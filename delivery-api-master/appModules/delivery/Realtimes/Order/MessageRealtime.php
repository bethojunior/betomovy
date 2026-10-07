<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/08/2020
 * Time: 16:31
 */

namespace Delivery\Realtimes\Order;


use App\Contracts\Repository\RethinkRepository;

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
