<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/12/2019
 * Time: 20:06
 */

namespace App\Services\Monetization;


use App\Constants\StatusConst;
use App\Models\Monetization\Cashback;
use App\Repositories\Monetization\CashbackRepository;

class CashbackService
{
    /**
     * @var CashbackRepository
     */
    private $repository;

    public function __construct(CashbackRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request = [])
    {
        $cashbacks = $this->repository
            ->findAll($request);

        return $cashbacks->isEmpty() ? null : $cashbacks;
    }

    public function insert(array $request)
    {
        $cashback = new Cashback($request);

        $this->repository
            ->save($cashback);

        return $cashback;
    }

    public function updateStatus($id, int $active = 1)
    {
        /** @var Cashback $cashback */
        $cashback = $this->repository
            ->find($id);

        $cashback
            ->active = $active;

        $this->repository
            ->save($cashback);

        return $cashback;
    }

    public function delete($id)
    {
        /** @var Cashback $cashback */
        $cashback = $this->repository
            ->find($id);

        $cashback
            ->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($cashback);

        return $cashback;
    }
}
