<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/07/2019
 * Time: 19:15
 */

namespace App\Repositories\Trip\ChatTrip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\ChatTrip\ChatTrip;

class ChatTripRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(ChatTrip::class);
    }

    public function findByTrip($tripReference)
    {
        return $this->getModel()
            ::where('tripReference', $tripReference)
            ->first();
    }
}
