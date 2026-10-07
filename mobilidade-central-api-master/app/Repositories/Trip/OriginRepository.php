<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 21:48
 */

namespace App\Repositories\Trip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\Origin;

class OriginRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Origin::class);
    }
}
