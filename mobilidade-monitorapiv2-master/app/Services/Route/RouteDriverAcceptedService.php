<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/12/2019
 * Time: 16:26
 */

namespace App\Services\Route;


use App\Constants\StatusConst;
use App\Models\Route\RouteDriverAccepted;
use App\Repositories\Route\RouteDriverAcceptedRepository;

class RouteDriverAcceptedService
{
    /**
     * @var RouteDriverAcceptedRepository
     */
    private $repository;

    public function __construct(RouteDriverAcceptedRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request = [])
    {
        return $this->repository
            ->findAll($request);
    }

    public function updateStatus($id, int $active = 1)
    {
        /** @var RouteDriverAccepted $routeDriverAccepted */
        $routeDriverAccepted = $this->repository
            ->find($id);

        $routeDriverAccepted
            ->active = $active;

        $this->repository
            ->save($routeDriverAccepted);

        return $routeDriverAccepted;
    }

    public function delete($id)
    {
        /** @var RouteDriverAccepted $route */
        $routeDriverAccepted = $this->repository
            ->find($id);

        $routeDriverAccepted
            ->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($routeDriverAccepted);

        return $routeDriverAccepted;
    }
}
