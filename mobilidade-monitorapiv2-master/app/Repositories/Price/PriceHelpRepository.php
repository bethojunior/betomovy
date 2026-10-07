<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/09/2019
 * Time: 10:08
 */

namespace App\Repositories\Price;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Price\PriceHelp;
use Illuminate\Database\Eloquent\Builder;

class PriceHelpRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(PriceHelp::class);
    }

    public function findAll(array $queryRequest = [])
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->when(isset($queryRequest['cityId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('cityId', $queryRequest['cityId']);
            })
            ->whereHas('accessibilityHelp', function (Builder $query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE);
            })
            ->with('accessibilityHelp')
            ->get();
    }
}
