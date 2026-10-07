<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/11/2019
 * Time: 18:01
 */

namespace App\Repositories\Route;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Route\RouteTripItemType;

class RouteTripItemTypeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(RouteTripItemType::class);
    }
}
