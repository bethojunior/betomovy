<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/11/2019
 * Time: 11:43
 */

namespace App\Repositories\Route;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Route\RouteWayPoint;

class RouteWayPointRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(RouteWayPoint::class);
    }

    public function removeWayPointByRoute($routeId)
    {
        $this->getModel()
            ::where("routeId", $routeId)
            ->update([
                "statusId"=> StatusConst::REMOVED
            ]);
    }
}
