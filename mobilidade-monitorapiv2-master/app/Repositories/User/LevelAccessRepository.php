<?php

namespace App\Repositories\User;

use App\Contracts\Repository\AbstractRepository;
use App\Models\User\LevelAccess;

class LevelAccessRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(LevelAccess::class);
    }

    public function findByUserId(int $userId)
    {
        return $this->getQuery()
            ->where('userId', $userId)
            ->first();
    }

    public function findByUserTypeIds(array $userTypeIds)
    {
        return $this->getQuery()
            ->whereIn('userTypeId', $userTypeIds)
            ->get();
    }
}
