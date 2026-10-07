<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/09/2019
 * Time: 14:09
 */

namespace App\Services\Balance;


use App\Repositories\Balance\BalanceFlowRepository;
use App\Constants\Push\PushConfigConst;
use App\Models\User\Customer;
use App\Models\User\Driver;
use App\Models\Balance\BalanceFlowType;
use App\Models\Balance\BalanceFlow;
use App\Models\Balance\Balance;
use App\Constants\Balance\BalanceFlowTypeConst;
use App\Helpers\Push\PushHelper;
use App\Documents\Log;
use App\Constants\AppConst;

class BalanceService
{
    /**
     * @var BalanceFlowRepository
     */
    private $repository;
    private $pushHelper;

    public function __construct(BalanceFlowRepository $repository, PushHelper $pushHelper)
    {
        $this->repository = $repository;
        $this->pushHelper = $pushHelper;
    }

    public function findSearchable()
    {
        return $this->repository->findSearchable();
    }

    public function manageBalanceAction(int $id, array $request, int $userId)
    {
        if ($request['action'] == 'insert')
            return $this->insertBalanceCustomer($id, $request, $userId);

        if ($request['action'] == 'block')
            return $this->blockBalanceCustomer($id, $request, $userId);
    }

    public function insertBalanceCustomer(int $id, array $request, int $userId)
    {
        $customer = Customer::find($id);

        if (!$customer)
            throw new \Exception('Cliente não encontrado');

        $balance = $customer->balance;

        $currentBalance = is_null($balance->tripBalance) ? 0 : floatval($balance->tripBalance);

        $balance->tripBalance = (floatval($currentBalance) + floatval($request['balance']));

        $balance->save();

        $balanceFlowType = BalanceFlowType::find(BalanceFlowTypeConst::VOUCHER_BONUS);

        $balanceFlow = new BalanceFlow();

        $balanceFlow->value = $request['balance'];
        $balanceFlow->balanceFlowTypeId = $balanceFlowType->idBalanceFlowType;
        $balanceFlow->balanceId = $balance->idBalance;
        $balanceFlow->responsibleUserId = $userId;

        $balanceFlow->save();

        $this->pushHelper->sendByKey(PushConfigConst::CUSTOMER_VOUCHER_INSERTED, $customer->user->deviceToken);

        return $balance;
    }

    public function blockBalanceCustomer(int $id, array $request, int $userId)
    {
        $customer = Customer::find($id);

        if (!$customer)
            throw new \Exception('Cliente não encontrado');

        $balance = $customer->balance;

        $currentBalance = $balance->tripBalance ?? 0;

        if ($request['balance'] > $currentBalance)
            throw new \Exception('Não é possível bloquear um saldo maior que o saldo atual !');

        $currentBlockedBalance = is_null($balance->withheldBalance) ? 0 : $balance->withheldBalance;

        $balance->tripBalance = ($currentBalance - $request['balance']);
        $balance->withheldBalance = ($request['balance'] + $currentBlockedBalance);


        $balance->save();

        $balanceFlowType = BalanceFlowType::find(BalanceFlowTypeConst::VOUCHER_BLOCKED);

        $balanceFlow = new BalanceFlow();

        $balanceFlow->value = $request['balance'];
        $balanceFlow->balanceFlowTypeId = $balanceFlowType->idBalanceFlowType;
        $balanceFlow->balanceId = $balance->idBalance;
        $balanceFlow->responsibleUserId = $userId;

        $balanceFlow->save();

        return $balance;
    }

    public function insertBalanceDriver(int $driverId, array $request, int $userId)
    {
        $driver = Driver::find($driverId);

        if (!$driver)
            throw new \Exception('Motorista não encontrado');

        $balance = $driver->balance;

        $balance->balance += $request['value'];
        $balance->save();

        $balanceFlowType = BalanceFlowType::find($request['value'] < 0 ? BalanceFlowTypeConst::BALANCE_OUT_MANUAL : BalanceFlowTypeConst::BALANCE_BONUS);

        $balanceFlow = new BalanceFlow();

        $balanceFlow->value = $request['value'] < 0 ? -$request['value'] : $request['value'];
        $balanceFlow->balanceFlowTypeId = $balanceFlowType->idBalanceFlowType;
        $balanceFlow->balanceId = $balance->idBalance;
        $balanceFlow->responsibleUserId = $userId;
        if (!empty($request['observation'])) {
            $balanceFlow->observation = $request['observation'];
        }
        $balanceFlow->save();

        $this->createLog($driverId, $request, $balance, $userId);

        return $balance;
    }

    private function createLog($driverId, $request, Balance $balance, int $userId): Log
    {
        $log = new Log();
        $log->data = (object)[
            'request' => $request,
            'newBalance' => $balance->toArray()
        ];
        $log->idReference = $driverId;
        $log->userId = $userId;
        $log->message = "ADMINISTRADOR ADICIONOU SALDO AO MOTORISTA";
        $log->app = AppConst::MONITOR;
        $log->save();

        return $log;
    }
}
