<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/10/2019
 * Time: 17:20
 */

namespace App\Repositories\Trip;


use App\Constants\PaginationConst;
use App\Constants\StatusConst;
use App\Constants\Trip\TripCancellationCustomerFeeConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Role\Role;
use App\Models\Trip\TripCancellationCustomerFee;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class TripCancellationCustomerFeeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(TripCancellationCustomerFee::class);
    }

    public function getAll(array $queryRequest = [])
    {
        return $this->getModel()
            ::orderByDesc('id')
            ->with([
                'tripCancellationFeeType',
                'trip' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'tripReference',
                            'date',
                            'endDate',
                            'price',
                            'driverName',
                            'driverPhoto',
                            'status',
                            'paymentForm',
                            'tripType',
                            'tripCallType',
                            'cityId',
                            'cityName');
                },
                'paidByTrip' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'tripReference',
                            'date',
                            'endDate',
                            'price',
                            'driverName',
                            'driverPhoto',
                            'status',
                            'paymentForm',
                            'tripType',
                            'tripCallType',
                            'cityId',
                            'cityName');
                },
                'user' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'idUser',
                            'name',
                            'email',
                            'phone');
                },
                'driver' => function (BelongsTo $query) {
                    $query
                        ->join('user', 'driver.userId', '=', 'idUser')
                        ->join('levelAccess', 'levelAccess.userId', '=', 'idUser')
                        ->join('userType', 'userTypeId', '=', 'idUserType')
                        ->select(
                            'idDriver',
                            'idUser',
                            'user.name',
                            'email',
                            'phone',
                            'userType.name AS userType');
                }
            ])
            ->when(!isset($queryRequest['withTrash']), function (Builder $query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE);
            })
            ->when(isset($queryRequest['cityId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->whereHas('trip', function (Builder $query) use ($queryRequest) {
                        $query
                            ->where('cityId', $queryRequest['cityId']);
                    });
            })
            ->when(isset($queryRequest['driverId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('driverId', $queryRequest['driverId']);
            })
            ->when(isset($queryRequest['userId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('userId', $queryRequest['userId']);
            })
            ->when(isset($request['billingStatus']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('billing_status', $queryRequest['billingStatus']);
            })
            ->when(isset($queryRequest['dateStart']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where(
                        'created_at',
                        '>=',
                        Carbon::parse($queryRequest['dateStart'])->startOfDay());
            })
            ->when(isset($queryRequest['dateEnd']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where(
                        'created_at',
                        '<=',
                        Carbon::parse($queryRequest['dateEnd'])->endOfDay());
            })
            ->paginate($queryRequest['limit_per_page'] ?? PaginationConst::LIMIT_PER_PAGE);
    }

    public function findAll(Role $authRole, array $queryRequest = [])
    {
        return $this->getModel()
            ::orderByDesc('tripCancellationCustomerFee.id')
            ->join('tripCancellationFeeType as tcft', 'tripCancellationCustomerFee.tripCancellationFeeTypeId', 'tcft.id')
            ->join('trip as t', 'tripCancellationCustomerFee.tripReference', 't.tripReference')
            ->leftJoin('trip as tPaid', 'tripCancellationCustomerFee.paid_tripReference', 'tPaid.tripReference')
            ->leftJoin('tripPaymentForm as tpf', 't.tripPaymentFormId', 'tpf.idTripPaymentForm')
            ->leftJoin('tripType as tt', 't.tripTypeId', 'tt.idTripType')
            ->leftJoin('tripCallType as tct', 't.tripCallTypeId', 'tct.id')
            ->leftJoin('city as c', 't.cityId', 'c.id')
            ->join('user as u', 'tripCancellationCustomerFee.userId', 'u.idUser')
            ->join('driver as d', 'tripCancellationCustomerFee.driverId', 'd.idDriver')
            ->leftJoin('driver as dPaid', 'tPaid.driverId', 'dPaid.idDriver')
            ->join('user as ud', 'd.userId', '=', 'ud.idUser')
            ->leftJoin('user as uPaid', 'dPaid.userId', '=', 'uPaid.idUser')
            ->join('levelAccess as lad', 'ud.idUser', '=', 'lad.userId')
            ->join('userType as utd', 'lad.userTypeId', '=', 'utd.idUserType')
            ->select(
                'tripCancellationCustomerFee.id',
                'tripCancellationCustomerFee.feeValue',
                'tripCancellationCustomerFee.statusId',
                'tripCancellationCustomerFee.paid_tripReference',
                'tripCancellationCustomerFee.created_at',
                DB::raw('COALESCE(tripCancellationCustomerFee.scheduledPaymentDate, tripCancellationCustomerFee.updated_at) as paymentDate'),
                'tcft.id as tripCancellationFeeTypeId',
                'tcft.name as tripCancellationFeeTypeName',
                'tcft.description as tripCancellationFeeTypeDescription',
                'tcft.statusId as tripCancellationFeeType',
                'tcft.created_at as tripCancellationFeeTypeCreatedAt',
                'tcft.updated_at as tripCancellationFeeTypeUpdatedAt',
                't.tripReference',
                't.date',
                't.endDate',
                't.price',
                't.status',
                'tpf.name as paymentForm',
                'tt.type as tripType',
                'tct.name as tripCallType',
                't.cityId',
                'c.nome as cityName',
                'u.idUser',
                'u.name as userName',
                'u.email as userEmail',
                'u.phone as userPhone',
                'd.idDriver',
                'ud.idUser as driverUserId',
                'ud.name as driverName',
                'ud.email as driverEmail',
                'ud.phone as driverPhone',
                'utd.name as driverUserType',
                'dPaid.idDriver as idDriverPaid',
                'uPaid.name as driverPaidName'
            )
            ->when(!isset($queryRequest['withTrash']), function (Builder $query) {
                $query
                    ->where('tripCancellationCustomerFee.statusId', StatusConst::ACTIVE);
            })
            ->when(isset($queryRequest['cityId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('t.cityId', $queryRequest['cityId']);
            })
            ->when(!$authRole->support, function (Builder $query) use ($authRole) {
                $query->whereIn('t.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $authRole->id);
                });
            })
            ->when(isset($queryRequest['driverId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('tripCancellationCustomerFee.driverId', $queryRequest['driverId']);
            })
            ->when(isset($queryRequest['userId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('tripCancellationCustomerFee.userId', $queryRequest['userId']);
            })
            ->when(isset($request['billingStatus']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('tripCancellationCustomerFee.billing_status', $queryRequest['billingStatus']);
            })
            ->when(isset($queryRequest['dateStart']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where(
                        'tripCancellationCustomerFee.created_at',
                        '>=',
                        Carbon::parse($queryRequest['dateStart'])->startOfDay());
            })
            ->when(isset($queryRequest['dateEnd']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where(
                        'tripCancellationCustomerFee.created_at',
                        '<=',
                        Carbon::parse($queryRequest['dateEnd'])->endOfDay());
            })
            ->paginate($queryRequest['limit_per_page'] ?? PaginationConst::LIMIT_PER_PAGE);
    }

    public function findByUser($userId)
    {
        return $this->getModel()
            ::where("userId", $userId)
            ->where("billing_status", TripCancellationCustomerFeeConst::TO_COLLECT)
            ->where("statusId", StatusConst::ACTIVE)
            ->get();
    }

    public function updatePaidTripReference($id, $tripReference)
    {
        return $this->getModel()::where("id", $id)
            ->update([
                "paid_tripReference" => $tripReference,
                "statusId" => StatusConst::ACTIVE,
                "billing_status" => TripCancellationCustomerFeeConst::TRANSFERRED
            ]);
    }
}
