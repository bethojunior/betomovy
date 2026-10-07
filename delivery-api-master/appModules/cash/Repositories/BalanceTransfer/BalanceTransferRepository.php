<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/07/2020
 * Time: 20:12
 */

namespace Cash\Repositories\BalanceTransfer;


use App\Contracts\Repository\AbstractRepository;
use Carbon\Carbon;
use Cash\Models\BalanceTransfer\BalanceTransfer;
use Illuminate\Database\Eloquent\Builder;

class BalanceTransferRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(BalanceTransfer::class);
    }

    public function financialStatementByUser(int $idUser, array $request)
    {
        return $this->getModel()
            ::whereHas('fromCustomerView', function (Builder $query) use ($idUser) {
                $query
                    ->where('idUser', $idUser);
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query
                    ->where('created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query
                    ->where('created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->orderByDesc('created_at')
            ->with('toCustomerView')
            ->when(isset($request['page']), function (Builder $query) {
                return $query->paginate();
            }, function (Builder $query) {
                return $query->get();
            });
    }

    public function findFully(int $id)
    {
        return $this->getModel()
            ::where('id', $id)
            ->with([
                'fromCustomerView',
                'toCustomerView',
                'cashPaymentForm'
            ])
            ->firstOrFail();
    }
}
