<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/12/2019
 * Time: 20:04
 */

namespace App\Repositories\Monetization;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Monetization\Cashback;
use Illuminate\Database\Eloquent\Builder;

class CashbackRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Cashback::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query
                    ->where('cityId', $request['cityId']);
            })
            ->when(isset($request['active']), function (Builder $query) use ($request) {
                $query
                    ->where('active', $request['active']);
            })
            ->when(isset($request['tripTypeId']), function (Builder $query) use ($request) {
                $query
                    ->where('tripTypeId', $request['tripTypeId']);
            })
            ->with(['city', 'tripType'])
            ->orderByDesc('created_at')
            ->orderByDesc('active')
            ->get();
    }
}
