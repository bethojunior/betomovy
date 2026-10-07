<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/11/2019
 * Time: 11:10
 */

namespace App\Repositories\RouteAudit;


use App\Contracts\Repository\AbstractRepository;
use App\Models\RouteAudit\RouteNotInternalAudit;

class RouteNotInternalAuditRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(RouteNotInternalAudit::class);
    }

    public function findPluckedByRoute($route)
    {
        return $this->getModel()
            ::where('route', $route)
            ->pluck('route')
            ->first();
    }
}
