<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/09/2019
 * Time: 09:37
 */

namespace App\Repositories\Balance;


use App\Constants\Balance\FlowTypeConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\BalanceFlow;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class BalanceFlowRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(BalanceFlow::class);
    }

    /**
     * @param array $request
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function financialStatementAdministrativeVoucher(array $request = [], $isSupport = false, $cityId = null)
    {

        return $this->getModel()
            ::join('balance', 'balanceFlow.balanceId', '=', 'balance.idBalance')
            ->join('company', 'balance.idBalance', '=', 'company.balanceId')
            ->join('balanceFlowType', 'balanceFlow.balanceFlowTypeId', '=', 'balanceFlowType.idBalanceFlowType')
            ->join('flowType', 'balanceFlowType.flowId', '=', 'flowType.id')
            ->select(
                'company.id AS companyId',
                'company.fantasyName AS fantasyName',
                'balanceFlow.date AS date',
                'balanceFlow.value AS value',
                'balanceFlowType.flow AS flow',
                'balanceFlowType.name AS name',
                'balanceFlowType.idBalanceFlowType'
            )
            ->when(isset($request['fantasyNameId']), function (Builder $query) use ($request) {
                $query->where('company.id', '=', $request['fantasyNameId']);
            })
            ->when(isset($request['flowTypeId']), function (Builder $query) use ($request) {
                $query->where('balanceFlowType.flowId', '=', $request['flowTypeId']);
            })
            ->when(!$isSupport && isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('company.cityId', $cityId);
            })
            ->orderByDesc('company.created_at')
            ->get();

    }


    public function insertWithRewardCampaignTrip($value, $balanceType, $balanceId, $rewardCampaignTripId)
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->date = Carbon::now();
        $balanceFlow->value = $value;
        $balanceFlow->balanceFlowTypeId = $balanceType;
        $balanceFlow->balanceId = $balanceId;
        $balanceFlow->rewardCampaignTripId = $rewardCampaignTripId;

        $balanceFlow->save();

        return $balanceFlow;
    }

    public function insert($value, $balanceType, $balanceId, $tripReference = null)
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->date = Carbon::now();
        $balanceFlow->value = $value;
        $balanceFlow->balanceFlowTypeId = $balanceType;
        $balanceFlow->balanceId = $balanceId;
        $balanceFlow->tripReference = $tripReference;

        $balanceFlow->save();

        return $balanceFlow;
    }

    public function insertWithCancellationFee($value, $balanceType, $balanceId, $customerCancellationFeeId)
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->date = Carbon::now();
        $balanceFlow->value = $value;
        $balanceFlow->balanceFlowTypeId = $balanceType;
        $balanceFlow->balanceId = $balanceId;
        $balanceFlow->customerCancellationFeeId = $customerCancellationFeeId;

        $balanceFlow->save();

        return $balanceFlow;
    }

    public function getBlockedFlowsTrip(string $tripReference = null)
    {
        return $this->getModel()::query()->join('balanceFlowType', 'balanceFlow.balanceFlowTypeId', 'balanceFlowType.idBalanceFlowType')
            ->whereIn('balanceFlowType.flowId', [FlowTypeConst::INPUT_BLOCKED, FlowTypeConst::OUT_BLOCKED])
            ->where(function (Builder $query) {
                $query->whereNotNull('balanceFlow.tripReference')
                    ->orWhereNotNull('balanceFlow.rewardTripId')
                    ->orWhereNotNull('balanceFlow.rewardCampaignTripId')
                    ->orWhereNotNull('balanceFlow.customerCancellationFeeId');
            })
            ->when(isset($tripReference), function (Builder $query) use ($tripReference) {
                $query->where(function (Builder $query) use ($tripReference) {
                    $query->where('balanceFlow.tripReference', $tripReference)
                        ->orWhere('balanceFlow.rewardTripId', function (\Illuminate\Database\Query\Builder $query) use ($tripReference) {
                            $query->select('rewardTripId')
                                ->from('trip')
                                ->where('tripReference', $tripReference)
                                ->limit(1);
                        })
                        ->orWhereIn('balanceFlow.rewardCampaignTripId', function (\Illuminate\Database\Query\Builder $query) use ($tripReference) {
                            $query->select('id')
                                ->from('rewardCampaignTrip')
                                ->where('tripReference', $tripReference);
                        })
                        ->orWhereIn('balanceFlow.customerCancellationFeeId', function (\Illuminate\Database\Query\Builder $query) use ($tripReference) {
                            $query->select('id')
                                ->from('tripCancellationCustomerFee')
                                ->where('paid_tripReference', $tripReference);
                        });
                });
            })
            ->orderByDesc('balanceFlow.date')
            ->get();
    }
}
