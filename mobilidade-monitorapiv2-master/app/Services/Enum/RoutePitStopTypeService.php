<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/12/2019
 * Time: 12:08
 */

namespace App\Services\Enum;


use App\Repositories\Enum\RoutePitStopTypeRepository;

class RoutePitStopTypeService
{
    /**
     * @var RoutePitStopTypeRepository
     */
    private $repository;

    public function __construct(RoutePitStopTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        return $this->repository->all();
    }
}
