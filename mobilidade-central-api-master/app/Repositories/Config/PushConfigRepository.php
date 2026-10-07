<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/10/2019
 * Time: 11:26
 */

namespace App\Repositories\Config;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\PushConfig;
use Illuminate\Database\Eloquent\Builder;

class PushConfigRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
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

    public function findMany(array $keys)
    {
        return $this->getModel()
            ::where(function (Builder $query) use ($keys){
                foreach ($keys as $key) {
                    $query
                        ->orWhere('key', $key);
                }
            })
//            ->select(['key', 'title', 'message'])
            ->get();
    }
}
