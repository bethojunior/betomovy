<?php

namespace App\Console\Commands\Trip;

use App\Models\User\User;
use App\Repositories\Trip\TripRepository;
use App\Services\Trip\CancelTripService;
use Illuminate\Console\Command;

class TripCallTimeoutCheckerCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trips:call-timeout-checker';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica se há chamadas procurando por muito tempo e atualiza o status da trip para not_answered';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(TripRepository $tripRepository, CancelTripService $cancelTripService)
    {
        $loopingTrips = $tripRepository->findTripsSearchingTooLong(10);
        if (empty($loopingTrips)) return;

        foreach ($loopingTrips as $trip) {
            $user = new User(['idUser' => $trip->userId]);
            $cancelTripService->cancel($trip->tripReference, $user, 'not_answered');
        }
    }
}
