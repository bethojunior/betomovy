<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/09/2019
 * Time: 14:09
 */

namespace App\Services\Balance;


use App\Repositories\Balance\BalanceFlowTypeRepository;

class BalanceFlowTypeService
{
    /**
     * @var BalanceFlowTypeRepository
     */
    private $repository;

    public function __construct(BalanceFlowTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findSearchable()
    {
        return $this->repository->findSearchable();
    }
}
