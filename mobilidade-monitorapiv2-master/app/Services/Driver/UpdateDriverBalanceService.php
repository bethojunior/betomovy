<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/09/2019
 * Time: 14:04
 */

namespace App\Services\Driver;


use App\Constants\Balance\FlowConst;
use App\Exceptions\Driver\DriverBalanceException;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Balance\BalanceFlowTypeRepository;
use App\Repositories\Balance\DriverBalanceRepository;

class UpdateDriverBalanceService
{
    /**
     * @var DriverBalanceRepository
     */
    private $repository;
    /**
     * @var BalanceFlowRepository
     */
    private $balanceFlowRepository;
    /**
     * @var BalanceFlowTypeRepository
     */
    private $balanceFlowTypeRepository;

    public function __construct(DriverBalanceRepository $repository,
                                BalanceFlowRepository $balanceFlowRepository,
                                BalanceFlowTypeRepository $balanceFlowTypeRepository)
    {
        $this->repository = $repository;
        $this->balanceFlowRepository = $balanceFlowRepository;
        $this->balanceFlowTypeRepository = $balanceFlowTypeRepository;
    }

    /**
     * @param $request
     * @return int|null
     * @throws \Exception
     */
    public function update($request)
    {
        $balances = isset($request['userTypeId']) ?
            $this->repository
                ->findByUserType($request['userTypeId']) :
            $this->repository
                ->findAll();

        $values = [];
        $balanceFlows = [];

        $value = abs($request['value']);
        $balanceFlowTypeId = $request['balanceFlowTypeId'];

        $balanceFlowType = $this->balanceFlowTypeRepository->find($balanceFlowTypeId);
        $value = $balanceFlowType->flow == FlowConst::OUT ?
            $value * -1 : $value;

        foreach ($balances as $balance) {
            $values += [$balance->idBalance => $value];
            $balanceFlows[] = [
                'balanceFlowTypeId' => $balanceFlowTypeId,
                'value' => abs($value),
                'balanceId' => $balance->idBalance,
                'date' => now(),
            ];
        }

        if ($balances->isEmpty())
            throw new DriverBalanceException("Nenhum motorista encontrado");

        try {
            \DB::beginTransaction();
            $result = $this->repository->updateManyBalances($values);

            $this->balanceFlowRepository
                ->createMany($balanceFlows);

            \DB::commit();
        } catch (\Exception $e) {

            \DB::rollBack();

            throw $e;
        }

        return $result;
    }
}
