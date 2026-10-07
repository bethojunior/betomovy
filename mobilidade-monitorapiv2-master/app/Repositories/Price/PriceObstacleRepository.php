<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/09/2019
 * Time: 16:11
 */

namespace App\Repositories\Price;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Price\PriceObstacle;
use Illuminate\Database\Eloquent\Builder;

class PriceObstacleRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(PriceObstacle::class);
    }

    public function findAll(array $queryRequest = [])
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->when(isset($queryRequest['cityId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('cityId', $queryRequest['cityId']);
            })
            ->whereHas('obstacle', function (Builder $query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE);
            })
            ->with('obstacle')
            ->get();
    }
}
