<?php

namespace App\Repositories\Config;

use App\Constants\AppConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\AppConfig;

class AppConfigRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(AppConfig::class);
    }

    public function disableByApp($appId)
    {
        return $this->getModel()
            ::where("appId", $appId)
            ->delete();
    }

    public function deleteById($id)
    {
        return $this->getModel()
            ::where("id",$id)
            ->delete();
    }

    public function findActiveByApp($appId)
    {
        return $this->getModel()::where('appId', $appId)->latest()->first();
    }
}
