<?php

namespace App\Console\Commands\Prepaid;

use App\Models\User\Driver;
use App\Repositories\Balance\CreditPrepaidPurchaseRepository;
use App\Repositories\User\DriverRepository;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;

class ManageDriverByPeriodCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'prepaid:manage-driver-by-period';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Gerenciar o motorista para desligar o mesmo se não tiver mais periodo disponivel';
    private $driverRepository;
    private $creditPrepaidPurchaseRepository;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(DriverRepository $driverRepository, CreditPrepaidPurchaseRepository $creditPrepaidPurchaseRepository)
    {
        parent::__construct();
        $this->driverRepository = $driverRepository;
        $this->creditPrepaidPurchaseRepository = $creditPrepaidPurchaseRepository;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        /** @var Collection $creditPrepaidPurchases */
        $creditPrepaidPurchases = $this->creditPrepaidPurchaseRepository->findAll([], true);
        if($creditPrepaidPurchases->isNotEmpty()) {
            foreach ($creditPrepaidPurchases as $creditPrepaidPurchase) {
                $driver = $this->driverRepository->findByUser($creditPrepaidPurchase->userId);
                $driver->status = 'desligado';

                $driver->save();
            }
        }
        return 0;
    }
}
