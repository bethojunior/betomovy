<?php

namespace App\Repositories\CallGroup;

use App\Contracts\Repository\AbstractRepository;
use App\Models\CallGroup\CallGroup;

class CallGroupRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CallGroup::class);
    }

    public function verifyExistCallGroupRegistered(String $name, int $weight)
    {
        return $this->getModel()::where('weight', $weight)
            ->orWhere('name', $name)
            ->exists();
    }

    public function verifyExistCallGroupByWeight(int $weight)
    {
        return $this->getModel()::where('weight', $weight)->first();
    }

    public function verifyExistCallGroupById(int $id)
    {
        return $this->getModel()::where('id', $id)->first();
    }
}
