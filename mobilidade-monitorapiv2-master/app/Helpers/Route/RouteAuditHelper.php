<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/11/2019
 * Time: 11:09
 */

namespace App\Helpers\Route;


use App\Repositories\RouteAudit\RouteNotInternalAuditRepository;

class RouteAuditHelper
{
    /**
     * @var RouteNotInternalAuditRepository
     */
    private $repository;

    public function __construct(RouteNotInternalAuditRepository $repository)
    {
        $this->repository = $repository;
    }

//    public function
}
