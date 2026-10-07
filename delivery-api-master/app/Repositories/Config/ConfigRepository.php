<?php
namespace App\Repositories\Config;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\Config;

class ConfigRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Config::class);
    }

    public function findByKey($key)
    {
        return $this->getModel()
            ::where('key', $key)
            ->first();
    }
}
