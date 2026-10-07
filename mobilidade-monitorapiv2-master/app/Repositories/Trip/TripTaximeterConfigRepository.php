<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/06/2020
 * Time: 11:34
 */

namespace App\Repositories\Trip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripTaximeterConfig;

class TripTaximeterConfigRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(TripTaximeterConfig::class);
    }
}
