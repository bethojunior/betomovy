<?php


namespace App\Services\CancellationReasons;


use App\Constants\StatusConst;
use App\Models\CancellationReasons\CancellationReasons;
use App\Repositories\CancellationReasons\CancellationReasonsRepository;
use App\Utils\RedisUtil;

class CancellationReasonsService
{
    /**
     * @var CancellationReasonsRepository
     */
    private $repository;

    /**
     * CancellationReasonsService constructor.
     * @param CancellationReasonsRepository $repository
     */
    public function __construct(CancellationReasonsRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function findAll()
    {
        return $this->repository->all();
    }

    /**
     * @param array $request
     * @return CancellationReasons
     */
    public function insert(array $request)
    {
        $cancellationReason = new CancellationReasons($request);

        $this->repository->save($cancellationReason);

        (new RedisUtil)->delete("cancellation_reasons");

        return $cancellationReason;
    }

    /**
     * @param $id
     * @param array $request
     * @return CancellationReasons
     */
    public function update($id, array $request)
    {
        $this->delete($id);

        (new RedisUtil)->delete("cancellation_reasons");

        return $this->insert($request);
    }

    /**
     * @param $id
     * @return bool
     */
    public function delete($id)
    {
        $cancellationReason = $this->repository->find($id);
        $cancellationReason->statusId = StatusConst::REMOVED;

        $this->repository->save($cancellationReason);

        (new RedisUtil)->delete("cancellation_reasons");

        return true;
    }
}
