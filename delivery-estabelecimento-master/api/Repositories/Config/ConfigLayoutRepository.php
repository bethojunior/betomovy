<?php

namespace Api\Repositories\Config;

use App\Models\Config\ConfigLayout;
use Common\Contracts\Repository\AbstractRepository;

class ConfigLayoutRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(ConfigLayout::class);
    }

    public function getLayout()
    {
        return $this->getModel()
            ::where("id", "1")
            ->select('*')
            ->first();
    }
}
