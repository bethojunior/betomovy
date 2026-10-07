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

    public function findMany(array $keys)
    {
        return $this->getModel()
            ::where(function (Builder $query) use ($keys){
                foreach ($keys as $key) {
                    $query
                        ->orWhere('key', $key);
                }
            })
            ->select(['key', 'value'])
            ->get();
    }
}
