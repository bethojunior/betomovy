<?php

namespace App\Repositories\Central;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\CentralUser;

class CentralUserRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CentralUser::class);
    }

    public function findByCentralUser($centralId, $userId)
    {
        return $this->getModel()::query()
            ->where('centralId', $centralId)
            ->where('userId', $userId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first();
    }

    public function findUsersByCentral(int $centralId)
    {
        return $this->getModel()::query()
            ->where('centralId', $centralId)
            ->where('statusId', StatusConst::ACTIVE)
            ->with(['user' => function ($query) {
                $query->select('idUser', 'name', 'email', 'phone');
            }])
            ->get();
    }

}
