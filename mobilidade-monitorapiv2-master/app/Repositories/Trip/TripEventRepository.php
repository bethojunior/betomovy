<?php


namespace App\Repositories\Trip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripEventsDetails;
use Illuminate\Support\Facades\DB;

class TripEventRepository extends AbstractRepository
{
  public function __construct()
  {
    $this->setModel(TripEventsDetails::class);
  }



  public function findTripEvents($tripReference)
  {
    return TripEventsDetails::query()
      ->where('tripReference', $tripReference)
      ->whereNotNull('data->tripReference')
      ->select([
        'created_at',
        'data->date as date',
        'type as message',
        'data->tripAuditId as tripAuditId',
        'data->origin->address as origin',
        'data->destination->name as destination',
        'data->driver->name as driver_name',
        'data->driver->email as driver_email',
        'data->driver->phone as driver_phone',
        'data->driver->location as driver_location',
      ])
      ->orderBy('created_at', 'asc')
      ->get()
      ->map(function ($item) {
        $item->driver_location = json_decode($item->driver_location, true);
        return $item;
      });
  }
}
