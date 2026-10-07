<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 16:34
 */

namespace App\Repositories\Config;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\Config;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ConfigRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
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
            ->select(['key', 'value', 'description', 'inputTypePro'])
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
            ->select(['key', 'value', 'description', 'inputTypePro'])
            ->get();
    }

    public function getConfigs(): Collection
    {
        return $this->getModel()
            ::getQuery()
            ->select(
                'ct.name AS type',
                \DB::raw(
                    "
                    JSON_ARRAYAGG(
                        JSON_OBJECT('key', config.key, 'value', config.value, 'description', config.description, 'inputTypePro', config.inputTypePro)
                    ) AS config
                ")
            )
            ->join('configType AS ct', 'ct.idConfigType', '=', 'config.configTypeId')
            ->where('config.frontEndConfigurable', true)
            ->groupBy('config.configTypeId')
            ->get();
    }
}
