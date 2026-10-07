<?php


namespace App\Repositories\Promotion;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Promotion\VoucherPromotion;
use App\Models\Role\Role;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;

class VoucherPromotionRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(VoucherPromotion::class);
    }

    public function findAll(array $request = [], Role $authRole = null)
    {
        return $this->getModel()::leftJoin('cityArea', function (JoinClause $join) {
            $join->on('voucherPromotion.cityId', 'cityArea.cityId');
            $join->where('cityArea.statusId', StatusConst::ACTIVE);
        })
            ->leftJoin('city', 'cityArea.cityId', 'city.id')
            ->select(
                'voucherPromotion.id',
                'amount',
                'value',
                'percentage',
                'cityArea.cityId',
                'city.nome as cityName',
                'voucherPromotion.user'
            )
            ->where('voucherPromotion.statusId', StatusConst::ACTIVE)
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('cityId', $request['cityId']);
            })
            ->when(isset($authRole) && !$authRole->support, function (Builder $query) use ($authRole) {
                $query->whereIn('voucherPromotion.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole){
                    $query->select('roleCity.cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authRole->id);
                });
            })
            ->paginate($request['per_page'] ?? 10);
    }
}
