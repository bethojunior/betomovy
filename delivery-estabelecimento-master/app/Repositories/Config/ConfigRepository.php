<?php

namespace App\Repositories\Config;

use App\Models\Config\Config;
use Common\Contracts\Repository\AbstractRepository;
use Illuminate\Database\Eloquent\Builder;

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

    public function findByType(int $configTypeId, ?bool $onlyRoot = false)
    {
        return $this->getModel()
            ::where('configTypeId', $configTypeId)
            ->where('frontEndConfigurable', true)
            ->when(!is_null($onlyRoot), function (Builder $query) use ($onlyRoot) {
                $query->where('onlyRoot', $onlyRoot);
            })
            ->select(['key', 'value', 'description'])
            ->get();
    }

    public function findMany(array $keys)
    {
        return $this->getModel()
            ::where(function (Builder $query) use ($keys){
                foreach ($keys as $key) {
                    $query
                        ->orWhere('key', $key);
                }
            })
            ->select(['key', 'value', 'description'])
            ->get();
    }
}
