<?php


namespace App\Services\Delivery;


use App\Constants\StatusConst;
use App\Models\Delivery\PayMachineReturn;
use App\Repositories\Delivery\PayMachineReturnRepository;
use Illuminate\Support\Facades\DB;

class PayMachineReturnService
{
    private $repository;

    public function __construct(PayMachineReturnRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param array $request
     * @return PayMachineReturn|\Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model|object|null
     * @throws \Exception
     */
    public function store(array $request)
    {
        try {
            DB::beginTransaction();
            $payMachineReturn = $this->repository->findByCity($request['cityId']);

            if ($payMachineReturn) {
                $payMachineReturn->statusId = StatusConst::REMOVED;
                $payMachineReturn->save();

                if ((empty($request['value']) && $request['value'] === 0)) {
                    DB::commit();
                    return $payMachineReturn;
                }
            }

            $payMachineReturn = new PayMachineReturn($request);
            $payMachineReturn->save();
            DB::commit();

            return $payMachineReturn;
        } catch (\Exception $exception) {
            DB::rollBack();
            throw new \Exception("Ocorreu um erro ao inserir taxa de devolução");
        }
    }

    public function getActive($cityId)
    {
        return $this->repository->findByCity($cityId);
    }
}
