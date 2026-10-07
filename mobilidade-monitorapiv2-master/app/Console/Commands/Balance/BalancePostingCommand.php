<?php

namespace App\Console\Commands\Balance;

use App\Constants\Balance\FlowConst;
use App\Constants\Notification\AdminNotificationTypeConst;
use App\Exceptions\Driver\DriverBalanceException;
use App\Models\Balance\BalanceFlow;
use App\Models\Balance\BalanceFlowPosted;
use App\Models\Balance\BalanceFlowType;
use App\Models\Balance\BalancePosting;
use App\Models\Notification\AdminNotification;
use App\Models\Notification\AdminNotificationType;
use App\Repositories\Balance\BalanceFlowPostedRepository;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Balance\BalanceFlowTypeRepository;
use App\Repositories\Balance\BalancePostingRepository;
use App\Repositories\Balance\DriverBalanceRepository;
use App\Repositories\Notification\AdminNotificationTypeRepository;
use Illuminate\Console\Command;

class BalancePostingCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'balance-posting:trigger';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispara os lançamentos financeiros do dia';
    /**
     * @var BalancePostingRepository
     */
    private $repository;
    /**
     * @var BalanceFlowPostedRepository
     */
    private $balanceFlowPostedRepository;
    /**
     * @var DriverBalanceRepository
     */
    private $driverBalanceRepository;
    /**
     * @var BalanceFlowTypeRepository
     */
    private $balanceFlowTypeRepository;
    /**
     * @var BalanceFlowRepository
     */
    private $balanceFlowRepository;
    /**
     * @var AdminNotificationTypeRepository
     */
    private $adminNotificationTypeRepository;

    /**
     * Create a new command instance.
     *
     * @param BalancePostingRepository $repository
     * @param BalanceFlowPostedRepository $balanceFlowPostedRepository
     * @param DriverBalanceRepository $driverBalanceRepository
     * @param BalanceFlowRepository $balanceFlowRepository
     * @param BalanceFlowTypeRepository $balanceFlowTypeRepository
     * @param AdminNotificationTypeRepository $adminNotificationTypeRepository
     */
    public function __construct(BalancePostingRepository $repository,
                                BalanceFlowPostedRepository $balanceFlowPostedRepository,
                                DriverBalanceRepository $driverBalanceRepository,
                                BalanceFlowRepository $balanceFlowRepository,
                                BalanceFlowTypeRepository $balanceFlowTypeRepository,
                                AdminNotificationTypeRepository $adminNotificationTypeRepository)
    {
        parent::__construct();
        $this->repository = $repository;
        $this->balanceFlowPostedRepository = $balanceFlowPostedRepository;
        $this->driverBalanceRepository = $driverBalanceRepository;
        $this->balanceFlowTypeRepository = $balanceFlowTypeRepository;
        $this->balanceFlowRepository = $balanceFlowRepository;
        $this->adminNotificationTypeRepository = $adminNotificationTypeRepository;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     * @throws \Throwable
     */
    public function handle()
    {
        $balancePostings = $this->repository
            ->findByBillingDay(now()->day);

        foreach ($balancePostings as $balancePosting) {
            $balanceFlowPosted = $this->balanceFlowPostedRepository
                ->findByBalancePostingToday($balancePosting->id);

            try {
                if ($balanceFlowPosted->isEmpty())
                    $this->dispatchBalancePosting($balancePosting);

            } catch (DriverBalanceException $e) {
                continue;
            }
        }

        return 1;
    }

    /**
     * @param BalancePosting $balancePosting
     * @return bool
     * @throws DriverBalanceException
     * @throws \Throwable
     */
    private function dispatchBalancePosting(BalancePosting $balancePosting): bool
    {
        $balances = $this->driverBalanceRepository
            ->findByUserType($balancePosting->userTypeId);

        if ($balances->isEmpty())
            throw new DriverBalanceException("Nenhum motorista encontrado");

        $values = [];
        $balanceFlows = [];

        $value = $balancePosting->value;
        $balanceFlowTypeId = $balancePosting->balanceFlowTypeId;

        /** @var BalanceFlowType $balanceFlowType */
        $balanceFlowType = $this->balanceFlowTypeRepository
            ->find($balanceFlowTypeId);
        $value = $balanceFlowType->flow == FlowConst::IN ?
            $value : $value * -1;

        foreach ($balances as $balance) {
            $values += [$balance->idBalance => $value];
            $balanceFlows[] = [
                'balanceFlowTypeId' => $balanceFlowTypeId,
                'value' => abs($value),
                'balanceId' => $balance->idBalance,
                'date' => now(),
            ];
        }

        try {
            \DB::beginTransaction();

            $this->driverBalanceRepository->updateManyBalances($values);

            foreach ($balanceFlows as $balanceFlow) {
                $balanceFlow = new BalanceFlow($balanceFlow);

                $this->balanceFlowRepository->save($balanceFlow);

                $balanceFlowPosted = new BalanceFlowPosted;
                $balanceFlowPosted->balancePostingId = $balancePosting->id;
                $balanceFlowPosted->balanceFlowId = $balanceFlow->idBalanceFlow;

                $this->balanceFlowPostedRepository->save($balanceFlowPosted);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            return false;
        }

        $this->notifyAdmins($balancePosting);

        return true;
    }

    private function notifyAdmins(BalancePosting $balancePosting): AdminNotification
    {
        /** @var AdminNotificationType $adminNotificationType */
        $adminNotificationType = $this->adminNotificationTypeRepository
            ->find(AdminNotificationTypeConst::BALANCE_POSTING_FINISHED);

        $message = $adminNotificationType->defaultMessage .
            ". Categoria: {$balancePosting->userType->name}";

        $adminNotification = new AdminNotification;
        $adminNotification->adminNotificationTypeId = $adminNotificationType->id;
        $adminNotification->message = $message;
        $adminNotification->title = $adminNotificationType->name;
        $adminNotification->save();

        return $adminNotification;
    }
}
