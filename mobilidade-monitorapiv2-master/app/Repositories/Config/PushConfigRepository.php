<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/01/2020
 * Time: 16:18
 */

namespace App\Repositories\Config;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\PushConfig;

class PushConfigRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(PushConfig::class);
    }

    public function findByKey($key)
    {
        return $this->getModel()
            ::where('key', $key)
            ->first();
    }
}
