<?php

namespace App\Repositories\App;

use App\Contracts\Repository\AbstractRepository;
use App\Models\App\AppAnimation;

class AppAnimationRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(AppAnimation::class);
    }

    public function getAll()
    {
      return $this->all();
    }
}
