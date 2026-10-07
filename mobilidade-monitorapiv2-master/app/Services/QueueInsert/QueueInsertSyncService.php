<?php

namespace App\Services\QueueInsert;

use App\Repositories\Log\QueueInsertRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class QueueInsertSyncService
{
    private QueueInsertRepository $queueInsertRepository;

    public function __construct(QueueInsertRepository $queueInsertRepository)
    {
        $this->queueInsertRepository = $queueInsertRepository;
    }

    private const LOCK_SECONDS = 600;
    private const CHUNK_SIZE = 200;

    public function sync(): array
    {
        $lock = Cache::lock('queue_insert_sync', self::LOCK_SECONDS);

        if (!$lock->get()) {
            return [
                'synced' => 0,
                'pending' => (int) $this->queueInsertRepository->count(),
                'message' => 'Sincronização já em andamento',
            ];
        }

        try {
            $synced = 0;
            $repository = $this->queueInsertRepository;

            $repository->chunk(self::CHUNK_SIZE, function ($chunk) use (&$synced, $repository) {
                if ($chunk->isEmpty()) {
                    return false;
                }

                $grouped = [];
                $idsToDelete = [];

                foreach ($chunk as $insert) {
                    $grouped[$insert->tableToInsert][] = (array) $insert->data;
                    $idsToDelete[] = $insert->_id;
                }

                foreach ($grouped as $table => $rows) {
                    DB::table($table)->insert($rows);
                    $synced += count($rows);
                }

                $repository->deleteMany($idsToDelete);
            });

            $remaining = (int) $this->queueInsertRepository->count();

            return [
                'synced' => $synced,
                'pending' => $remaining,
            ];
        } finally {
            optional($lock)->release();
        }
    }
}

