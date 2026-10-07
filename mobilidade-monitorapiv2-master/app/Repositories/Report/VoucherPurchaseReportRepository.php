<?php


namespace App\Repositories\Report;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Role\Role;
use App\Models\Trip\VoucherPurchase;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class VoucherPurchaseReportRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(VoucherPurchase::class);
    }

    public function findAll(array $request = [], Role $authRole = null)
    {
        return $this->getModel()
            ::when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $dateStart = Carbon::parse($request['dateStart'])
                    ->startOfDay();
                $query->where('voucherPurchase.created_at', '>=', $dateStart);
            })
            ->when(isset($request['dateEnd']), function (Builder  $query) use ($request) {
                $dateStart = Carbon::parse($request['dateStart'])
                    ->startOfDay();
                $query->where('voucherPurchase.created_at', '>=', $dateStart);
            })
            ->join('user', 'voucherPurchase.userId', '=', 'user.idUser')
            ->join('transaction', 'transaction.idTransaction', '=', 'voucherPurchase.transactionId')
            ->join('paymentForm', 'paymentForm.idPaymentForm', '=', 'transaction.paymentFormId')
            ->join('financialIntermediary', 'transaction.intermediaryId', '=', 'financialIntermediary.idFinancialIntermediary')
            ->join('transactionStatus', 'transaction.transactionStatusId', '=', 'transactionStatus.idTransactionStatus')
            ->when(!$authRole->support, function (Builder $query) use ($authRole) {
                $query->join('cityArea', function (JoinClause $join) use ($authRole) {
                    $join->where('cityArea.statusId', StatusConst::ACTIVE)
                        ->whereIn('cityArea.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole){
                            $query->select('cityId')
                                ->from('roleCity')
                                ->where('roleCity.roleId', $authRole->id);
                        })
                        ->where(function (\Illuminate\Database\Query\Builder $query) {
                            $query->whereColumn('user.cityId', 'cityArea.cityId')
                                ->orWhereRaw('(ST_CONTAINS(cityArea.polygon, POINT(user.last_lat, user.last_lon)))');
                        });
                });
            })
            ->orderBy('voucherPurchase.idVoucherPurchase')
            ->select([
                'idVoucherPurchase',
                'voucherPurchase.amount',
                'voucherPurchase.value',
                'voucherPurchase.created_at',
                'voucherPurchase.transactionId',
                'transaction.status',
                'transaction.status_detailed',
                'transaction.generatedPaymentId',
                'user.name',
                'user.email',
                'user.phone',
                'paymentForm.name AS paymentForm',
                'financialIntermediary.name AS acquirer',
                'transactionStatus.name AS transactionStatus',
            ])
            ->get();
    }

    public function findByStatus(){
        return $this->getModel()
            ::join('transaction', 'voucherPurchase.transactionId', '=', 'transaction.idTransaction')
            ->where('transaction.paymentFormId', 4)
            ->where('transaction.transactionStatusId', 3)
            ->select(['*'])
            ->get();
    }

    public function updateStatus($id, $status, $statusId)
    {
        return $this->getModel()
            ::join('transaction', 'voucherPurchase.transactionId', '=', 'transaction.idTransaction')
            ->where('transaction.generatedPaymentId', $id)
            ->update([
                'voucherPurchase.status' => $status,
                'transaction.transactionStatusId' => $statusId,
                'transaction.status' => $status,
                'transaction.status_detailed' => $status
            ]);
    }
}
