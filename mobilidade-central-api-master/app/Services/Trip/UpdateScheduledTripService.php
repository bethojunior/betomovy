<?php

namespace App\Services\Trip;

use App\Contracts\Realtime\TripRealtimeService;
use App\Models\Trip\Trip;
use App\Models\Trip\TripWayPoint;
use App\Realtimes\Trip\Trip as RealtimeTrip;
use App\Repositories\Trip\DestinationRepository;
use App\Repositories\Trip\OriginRepository;
use App\Repositories\Trip\TripRepository;
use App\Repositories\Trip\TripScheduledRepository;
use Carbon\Carbon;

class UpdateScheduledTripService
{
    /**
     * @var TripRepository
     */
    private $repository;
    /**
     * @var OriginRepository
     */
    private $originRepository;
    /**
     * @var DestinationRepository
     */
    private $destinationRepository;
    /**
     * @var TripScheduledRepository
     */
    private $tripScheduledRepository;
    /**
     * @var TripRealtimeService
     */
    private $tripRealtimeService;

    public function __construct(
        TripRepository $repository,
        OriginRepository $originRepository,
        DestinationRepository $destinationRepository,
        TripScheduledRepository $tripScheduledRepository,
        TripRealtimeService $tripRealtimeService
    ) {
        $this->repository = $repository;
        $this->originRepository = $originRepository;
        $this->destinationRepository = $destinationRepository;
        $this->tripScheduledRepository = $tripScheduledRepository;
        $this->tripRealtimeService = $tripRealtimeService;
    }

    /**
     * @param string $tripReference
     * @param array $request
     * @param string $scope 'this' edita só a viagem informada; 'all' também
     *   aplica origem/destino/preço/paradas às demais viagens agendadas do
     *   mesmo lote (scheduledBatchId) — a data/hora de cada uma não é tocada,
     *   já que cada viagem do lote é independente e tem seu próprio dia.
     * @return Trip
     * @throws \Exception
     */
    public function update($tripReference, array $request, string $scope = 'this')
    {
        $trip = $this->updateOne($tripReference, $request);

        if ($scope === 'all' && $trip->scheduledBatchId) {
            $trip->setAttribute('groupUpdate', $this->applyToGroupSiblings($trip, $request));
        }

        return $trip;
    }

    /**
     * @param string $tripReference
     * @param array $request
     * @return Trip
     * @throws \Exception
     */
    private function updateOne($tripReference, array $request)
    {
        try {
            \DB::beginTransaction();

            /** @var Trip $trip */
            $trip = $this->repository
                ->findByReference($tripReference);

            $origin = $this->originRepository->create($request['origin']);
            $destination = $this->destinationRepository->create($request['destination']);

            $this->repository
                ->updateByTripReference($tripReference, [
                    'originId' => $origin->idOrigin,
                    'destinationId' => $destination->idDestination,
                    'price' => $request['price'],
                ]);

            $this->tripScheduledRepository
                ->updateById($tripReference, [
                    'schedule' => Carbon::parse($request['schedule'])->toDateTimeString(),
                    'scheduleUTC' => Carbon::parse($request['scheduleUTC'])->toDateTimeString(),
                ], 'tripReference');

            if (array_key_exists('waypoints', $request)) {
                $this->updateWaypoints($trip, $request['waypoints']);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        /** @var Trip $trip */
        $trip = $this->repository->findFully($tripReference);

        $this->sendToRealtime($trip);

        return $trip;
    }

    /**
     * Aplica origem/destino/preço/paradas às demais viagens agendadas do mesmo
     * lote. As viagens do lote podem estar com origin/destination compartilhada
     * (criadas juntas, nunca editadas individualmente) ou já "forkadas" (uma
     * delas foi editada via updateOne(), que sempre cria uma linha nova) —
     * atualizar pelo originId/destinationId ATUAL de cada sibling, um por um,
     * é seguro nos dois casos: não corrompe o endereço das demais.
     *
     * @param Trip $trip
     * @param array $request
     * @return array{updated: string[], failed: array{tripReference: string, error: string}[]}
     */
    private function applyToGroupSiblings(Trip $trip, array $request): array
    {
        $siblings = $this->repository
            ->findEditableBatchSiblings($trip->scheduledBatchId, $trip->tripReference);

        $updated = [];
        $failed = [];

        foreach ($siblings as $sibling) {
            try {
                \DB::beginTransaction();

                $this->originRepository
                    ->updateById($sibling->originId, $request['origin'], 'idOrigin');

                $this->destinationRepository
                    ->updateById($sibling->destinationId, $request['destination'], 'idDestination');

                $this->repository
                    ->updateByTripReference($sibling->tripReference, [
                        'price' => $request['price'],
                    ]);

                if (array_key_exists('waypoints', $request)) {
                    $this->updateWaypoints($sibling, $request['waypoints']);
                }

                \DB::commit();

                $this->sendToRealtime($this->repository->findFully($sibling->tripReference));

                $updated[] = $sibling->tripReference;
            } catch (\Exception $e) {
                \DB::rollBack();

                $failed[] = [
                    'tripReference' => $sibling->tripReference,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return compact('updated', 'failed');
    }

    private function updateWaypoints(Trip $trip, array $waypoints)
    {
        $trip->tripWayPoints()->delete();

        if (empty($waypoints)) {
            return;
        }

        $trip->tripWayPoints()->saveMany(array_map(function ($waypoint) use ($trip) {
            $tripWayPoint = new TripWayPoint($waypoint);
            $tripWayPoint->setAttribute('tripReference', $trip->getAttribute('tripReference'));

            return $tripWayPoint;
        }, $waypoints));
    }

    private function sendToRealtime(Trip $trip)
    {
        $tripRealtime = new RealtimeTrip;
        $tripRealtime->mount((object) $trip->toArray());

        return $this->tripRealtimeService->update($tripRealtime);
    }
}
