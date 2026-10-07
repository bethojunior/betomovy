<?php

namespace App\Repositories\Acquirer;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Acquirer\Acquirer;

class AcquirerRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Acquirer::class);
    }

    public function findById($id) {
        return $this->getModel()
            ::select('value')
            ->where('financialIntermediaryId', $id)
            ->where('isRoot', 0)
            ->get();
    }
}
