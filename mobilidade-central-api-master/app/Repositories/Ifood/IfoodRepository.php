<?php

namespace App\Repositories\Ifood;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Ifood\Ifood;

class IfoodRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Ifood::class);
    }


}
