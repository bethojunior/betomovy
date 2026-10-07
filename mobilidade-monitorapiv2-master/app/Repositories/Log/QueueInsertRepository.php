<?php

namespace App\Repositories\Log;

use App\Contracts\Repository\AbstractODMRepository;
use App\Documents\QueueInsert;

class QueueInsertRepository extends AbstractODMRepository
{

    public function __construct()
    {
        $this->setModel(QueueInsert::class);
    }

    public function count(): int
    {
        return $this->getModel()::count();
    }

    public function chunk(int $size, callable $callback): void
    {
        $this->getModel()::chunk($size, $callback);
    }

    public function deleteMany(array $ids): void
    {
        $this->getModel()::whereIn('_id', $ids)->delete();
    }
}
