<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;
use app\model\TripEventsDetails;
use app\queue\Jobs\PulseJob;
use app\queue\Queue;

/**
 * Created by BETHO`S BRAIN.
 */
class TripEventsDetailsDao extends BaseDao
{

  protected $table = 'tripEventsDetails';

  public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
  {
    parent::__construct(null, $sql);
  }

  public function store(array $data)
  {

    try {
      $sql = "
    INSERT INTO tripEventsDetails
    (tripReference, type, data, created_at, updated_at)
    VALUES
    (:tripReference, :type, :data, :created_at, :updated_at)
";

      $bind = [
        ':tripReference' => $data['tripReference'],
        ':type'          => $data['event'],
        ':data'          => json_encode($data['data']),
        ':created_at'    => now(),
        ':updated_at'    => now(),
      ];

      return $this->sqlRawExecute($sql, $bind);
    } catch (\Throwable $th) {
      // Queue::dispatch(
      //   PulseJob::class,
      //   [
      //     'message' => $th->getMessage(),
      //     'context' => $th->getTrace(),
      //     'type' => 'critical'
      //   ]
      // );
    }
  }
}
