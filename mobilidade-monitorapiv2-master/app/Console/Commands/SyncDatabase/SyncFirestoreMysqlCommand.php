<?php

namespace App\Console\Commands\SyncDatabase;

use App\Constants\Trip\TripConst;
use App\Realtimes\Trip\Trip;
use App\Repositories\Realtime\TripRepository;
use Illuminate\Console\Command;

class SyncFirestoreMysqlCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:sync-firebase-mysql';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincroniza as trips do firestore com o mysql';
    /**
     * @var TripRepository
     */
    private $realtimeTripRepository;
    /**
     * @var \App\Repositories\Trip\TripRepository
     */
    private $tripRepository;

    /**
     * Create a new command instance.
     *
     * @param TripRepository $realtimeTripRepository
     * @param \App\Repositories\Trip\TripRepository $tripRepository
     */
    public function __construct(TripRepository $realtimeTripRepository,
                                \App\Repositories\Trip\TripRepository $tripRepository)
    {
        parent::__construct();
        $this->realtimeTripRepository = $realtimeTripRepository;
        $this->tripRepository = $tripRepository;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Buscando viagens do firebase');
        $trips = $this->realtimeTripRepository->findAllTrips();

        $this->info('Foram encontradas: ' . count($trips) . ' viagens');
        $this->info('################################################');
        foreach ($trips as $tripRealtime) {
            $this->info('Analisando viagem: ' . $tripRealtime['tripReference']);
            $trip = $this->tripRepository
                ->findByReference($tripRealtime['tripReference']);

            if (!$trip) {
                $this->info('Viagem não encontrada no mysql');
                $this->info('Excluindo viagem do firebase');
                $this->realtimeTripRepository
                    ->setRealtime((new Trip)->mount((object) ['tripReference' => $tripRealtime['tripReference']]))
                    ->delete();
                continue;
            }

            if (in_array($trip->status, TripConst::OFF_STATUSES)) {
                $this->info('Excluindo viagem do firebase');

                $this->realtimeTripRepository
                    ->setRealtime((new Trip)->mount((object) $trip->toArray()))
                    ->delete();
            }
        }

        return 0;
    }
}
