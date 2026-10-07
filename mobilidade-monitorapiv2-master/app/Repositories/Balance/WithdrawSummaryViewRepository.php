<?php

namespace App\Repositories\Balance;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\WithdrawSummaryView;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Collection;

class WithdrawSummaryViewRepository extends AbstractRepository
{
    function __construct()
    {
        $this->setModel(WithdrawSummaryView::class);
    }

    public function findByWithdrawId($withdrawId)
    {
        return $this->getModel()
        ::where('idWithdraw', '=', $withdrawId)
        ->join('bankAccount', 'withdraw_summary_view.bankAccountId', '=', 'bankAccount.idBankAccount')
        ->select(
            'withdraw_summary_view.*',
            'bankAccount.pix'
            )
        ->first();
    }

    public function findAll(array $request = [], int $cityId = null, bool $isSupport = false)
    {
        return $this->getModel()
            ::with('recusedByUserRelation')
            ->when(isset($request['paid']), function (Builder $query) use ($request) {
                $query->where('paid', $request['paid']);
            })
            ->when(isset($request['recused']), function (Builder $query) use ($request) {
                $query->where('recused', $request['recused']);
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['isDriver']), function (Builder $query) use ($request) {
                $query->where('isDriver', $request['isDriver']);
            })
            ->when(isset($request['isCustomer']), function (Builder $query) use ($request) {
                $query->where('isCustomer', $request['isCustomer']);
            })
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query->where('name', 'LIKE', "%{$request['name']}%");
            })
            ->when(isset($request['document']), function (Builder $query) use ($request) {
                $query->where('document', 'LIKE', "%{$request['document']}%");
            })
            ->when(isset($request['phone']), function (Builder $query) use ($request) {
                $query->where('phone', 'LIKE', "%{$request['phone']}%");
            })
            ->when(isset($request['confirmationCode']), function (Builder $query) use ($request) {
                $query->where('confirmationCode', 'LIKE', "%{$request['confirmationCode']}%");
            })
            ->when(!$isSupport && isset($cityId), function (Builder $query) use ($cityId) {
                $query->join('user', 'user.idUser', 'withdraw_summary_view.userId')
                    ->leftJoin('driver', 'driver.userId', 'withdraw_summary_view.userId')
                    ->leftJoin('cityArea', function (JoinClause $join) {
                        $join->where('cityArea.statusId', StatusConst::ACTIVE)
                            ->whereRaw('(if(withdraw_summary_view.isDriver, driver.cityId = cityArea.cityId,
                                   user.cityId = cityArea.cityId or ST_CONTAINS(cityArea.polygon,
                                                                                POINT(user.last_lat, user.last_lon))))');
                    })
                    ->where('cityArea.cityId', $cityId);
            })
            ->leftJoin('user as userCity', 'userCity.idUser', 'withdraw_summary_view.userId')->leftJoin('city', 'city.id', 'userCity.cityId')
            ->leftJoin('bankAccount', 'withdraw_summary_view.bankAccountId', '=', 'bankAccount.idBankAccount')
            ->select(
                'withdraw_summary_view.*',
                'city.nome as city_name',
                'bankAccount.pix',
            )
            ->orderByDesc('withdraw_summary_view.created_at')
            ->when(isset($request['page']),
                function (Builder $query) {
                    return $query->paginate();
                },
                function (Builder $query) {
                    return $query->get();
                }
            );
    }
}
