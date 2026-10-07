<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/10/2019
 * Time: 09:41
 */

namespace App\Repositories\Freight\Accessibility;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Freight\ObstacleOnFloor;

class ObstacleOnFloorRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(ObstacleOnFloor::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
