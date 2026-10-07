<?php

namespace App\Repositories\User;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\BlacklistUser;
use Illuminate\Database\Eloquent\Collection;

class BlacklistUserRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(BlacklistUser::class);
    }

    public function getActivesByUser(int $userId): Collection
    {
        return $this->getQuery()
            ->where('userId', $userId)
            ->where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
