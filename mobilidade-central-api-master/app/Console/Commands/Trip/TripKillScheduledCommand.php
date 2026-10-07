<?php

namespace App\Console\Commands\Trip;

use App\Models\User\User;
use App\Repositories\Trip\TripRepository;
use App\Services\Trip\CancelTripService;
use Illuminate\Console\Command;
use App\Providers\PulseProvider;
use App\Utils\Pulse\GroupIds;

class TripKillScheduledCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trips:kill-scheduled-delayed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancela viagens agendadas que estão em estado de espera e não foram aceitas';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->pulseProvider = new PulseProvider("central-" . env('APP_NAME', 'laravel'), GroupIds::CENTRAL_PROD);
    }

    /**
     * @var PulseProvider
     */
    private $pulseProvider;

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(TripRepository $tripRepository, CancelTripService $cancelTripService)
    {
        $trips = $tripRepository->findScheduledTripsDelayedNoDriver();
        if (empty($trips)) return;

        $this->pulseProvider->warn("Encontradas " . count($trips) . " viagens agendadas atrasadas para cancelar.", self::class);

        foreach ($trips as $trip) {
            try {
                $user = new User(['idUser' => $trip->userId]);
                $cancelTripService->cancel($trip->tripReference, $user, 'not_answered');
                $this->pulseProvider->info("Viagem agendada [{$trip->tripReference}] cancelada por atraso.", self::class);
            } catch (\Throwable $e) {
                $this->pulseProvider->critical("Erro ao cancelar viagem agendada [{$trip->tripReference}]: " . $e->getMessage(), self::class);
            }
        }
    }
}
