<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/05/2020
 * Time: 14:23
 */

namespace App\Services\Balance;


use App\Constants\Balance\BalanceFlowConst;
use App\Exceptions\Balance\CreditPrepaidPurchaseException;
use App\Models\Balance\Balance;
use App\Models\Balance\CreditPrepaidPurchase;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Balance\CreditPrepaidPurchaseRepository;
use App\Repositories\Balance\DriverBalanceRepository;

class CreditPrepaidPurchaseService
{
    /**
     * @var CreditPrepaidPurchaseRepository
     */
    private $repository;
    /**
     * @var DriverBalanceRepository
     */
    private $driverBalanceRepository;
    /**
     * @var BalanceFlowRepository
     */
    private $balanceFlowRepository;

    public function __construct(CreditPrepaidPurchaseRepository $repository,
                                BalanceFlowRepository $balanceFlowRepository,
                                DriverBalanceRepository $driverBalanceRepository)
    {
        $this->repository = $repository;
        $this->driverBalanceRepository = $driverBalanceRepository;
        $this->balanceFlowRepository = $balanceFlowRepository;
    }

    public function findAll(array $request)
    {
        return $this->repository->findAll($request);
    }

    public function findByCityId(array $request)
    {
        $data = $this->repository->findAll($request);
        $array = [];
        foreach ($data as $value) {
            if($value->user->cityId == $request['cityId']) {
                $array[] = $value;
            }
        }
        return $array;
    }

    /**
     * @param CreditPrepaidPurchase $creditPrepaidPurchase
     * @return CreditPrepaidPurchase
     * @throws CreditPrepaidPurchaseException
     * @throws \Exception
     */
    public function credit(CreditPrepaidPurchase $creditPrepaidPurchase): CreditPrepaidPurchase
    {
        $this->validateAction($creditPrepaidPurchase);

        \DB::beginTransaction();

        try {
            if(!empty($creditPrepaidPurchase->amount)) {
                /** @var Balance $balance */
                $balance = $this->driverBalanceRepository
                    ->findByUserId($creditPrepaidPurchase->userId);

                $this->driverBalanceRepository
                    ->updateManyBalances([
                        $balance->idBalance => $creditPrepaidPurchase->amount
                    ]);

                $balanceFlow = $this->balanceFlowRepository->create([
                    'balanceFlowTypeId' => BalanceFlowConst::CREDIT_PREPAID_PURCHASE,
                    'value' => $creditPrepaidPurchase->amount,
                    'balanceId' => $balance->idBalance,
                    'date' => now(),
                ]);
            }

            $creditPrepaidPurchase->credited = true;
            $creditPrepaidPurchase->balanceFlowId = $balanceFlow->idBalanceFlow ?? null;
            $creditPrepaidPurchase->save();

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $creditPrepaidPurchase;
    }

    /**
     * @param CreditPrepaidPurchase $creditPrepaidPurchase
     * @return CreditPrepaidPurchase
     * @throws CreditPrepaidPurchaseException
     */
    public function refuse(CreditPrepaidPurchase $creditPrepaidPurchase): CreditPrepaidPurchase
    {
        $this->validateAction($creditPrepaidPurchase);

        $creditPrepaidPurchase->refused = true;
        $creditPrepaidPurchase->save();

        return $creditPrepaidPurchase;
    }

    /**
     * @param CreditPrepaidPurchase $creditPrepaidPurchase
     * @throws CreditPrepaidPurchaseException
     */
    private function validateAction(CreditPrepaidPurchase $creditPrepaidPurchase): void
    {
        if ($creditPrepaidPurchase->credited)
            throw new CreditPrepaidPurchaseException("Crédito já foi confirmado");

        if ($creditPrepaidPurchase->refused)
            throw new CreditPrepaidPurchaseException("Crédito já está recusado");
    }
}
