<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/12/2019
 * Time: 12:08
 */

namespace App\Repositories\Enum;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Route\RoutePitStopType;

class RoutePitStopTypeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(RoutePitStopType::class);
    }
}
