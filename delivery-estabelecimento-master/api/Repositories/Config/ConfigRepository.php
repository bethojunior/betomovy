<?php


namespace Api\Repositories\Config;

use App\Models\Config;
use Common\Contracts\Repository\AbstractRepository;

class ConfigRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Config::class);
    }

    public function findKeyMapbox()
    {
        return $this->getModel()
            ::where("key", "mapbox_access_token")
            ->select('value')
            ->first();
    }
}
