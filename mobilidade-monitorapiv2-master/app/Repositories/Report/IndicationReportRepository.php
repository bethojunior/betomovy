<?php


namespace App\Repositories\Report;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\UserIndication;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class IndicationReportRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(UserIndication::class);
    }

    public function findAll(array $request)
    {
        return $this->getModel()::query()
            ->join('user as uIndicated', 'userIndication.userIndicatedId', '=', 'uIndicated.idUser')
            ->join('user as uReferred', 'userIndication.whoIndicatedId', '=', 'uReferred.idUser')
            ->where('userIndication.statusId', StatusConst::ACTIVE)
            ->orderBy('uReferred.name')
            ->orderByDesc('userIndication.created_at')
            ->select(
                'uReferred.idUser as referredId',
                'uReferred.name as referredName',
                'uReferred.phone as referredPhone',
                'uReferred.email as referredEmail',
                'uIndicated.idUser as indicatedId',
                'uIndicated.name as indicatedName',
                'uIndicated.phone as indicatedPhone',
                'uIndicated.email as indicatedEmail'
            )
            ->when(isset($request['dateStart']),
                function (Builder $query) use ($request) {
                    $query
                        ->where(
                            'userIndication.created_at', '>=',
                            Carbon::parse($request['dateStart'])->startOfDay());
                })
            ->when(isset($request['dateEnd']),
                function (Builder $query) use ($request) {
                    $query
                        ->where(
                            'userIndication.created_at', '<=',
                            Carbon::parse($request['dateEnd'])->endOfDay());
                })
            ->get();
    }

//    public function findAll(array $request)
//    {
//        return $this->getModel()::query()
//            ->join('user as uIndicated', 'userIndication.userIndicatedId', '=', 'uIndicated.idUser')
//            ->join('user as uReferred', 'userIndication.whoIndicatedId', '=', 'uReferred.idUser')
//            ->where('userIndication.statusId', StatusConst::ACTIVE)
//            ->orderBy('uReferred.name')
//            ->orderByDesc('userIndication.created_at')
//            ->select(
//                'uReferred.idUser as referredId',
//                'uReferred.name as referredName',
//                'uReferred.phone as referredPhone',
//                'uReferred.email as referredEmail',
//                'uIndicated.idUser as indicatedId',
//                'uIndicated.name as indicatedName',
//                'uIndicated.phone as indicatedPhone',
//                'uIndicated.email as indicatedEmail'
//            )
//            ->when(isset($request['dateStart']),
//                function (Builder $query) use ($request) {
//                    $query
//                        ->where(
//                            'userIndication.created_at', '>=',
//                            Carbon::parse($request['dateStart'])->startOfDay());
//                })
//            ->when(isset($request['dateEnd']),
//                function (Builder $query) use ($request) {
//                    $query
//                        ->where(
//                            'userIndication.created_at', '<=',
//                            Carbon::parse($request['dateEnd'])->endOfDay());
//                })
//            ->get();
//    }

    public function findByWhoIndicatedId(array $request)
    {
        return $this->getModel()
            ::where('whoIndicatedId', $request['userId'])
            ->where('userIndication.statusId', StatusConst::ACTIVE)
            ->join('user as uWhoIndicated', 'userIndication.whoIndicatedId', '=', 'uWhoIndicated.idUser')
            ->join('levelAccess as levelAccessWhoIndicated', 'uWhoIndicated.idUser', '=', 'levelAccessWhoIndicated.userId')
            ->join('userType as userTypeWhoIndicated', 'levelAccessWhoIndicated.userTypeId', '=', 'userTypeWhoIndicated.idUserType')
            ->join('user as uIndicated', 'userIndication.userIndicatedId', '=', 'uIndicated.idUser')
            ->join('levelAccess as levelAccessIndicated', 'uIndicated.idUser', '=', 'levelAccessIndicated.userId')
            ->join('userType as userTypeIndicated', 'levelAccessIndicated.userTypeId', '=', 'userTypeIndicated.idUserType')
            ->select(
                'whoIndicatedId',
                'uWhoIndicated.name as whoIndicatedName',
                'userTypeWhoIndicated.name as whoIndicatedType',
                'uIndicated.idUser as indicatedId',
                'uIndicated.name as indicatedName',
                'uIndicated.phone as indicatedPhone',
                'uIndicated.email as indicatedEmail',
                'userTypeIndicated.name as indicatedType',
                'userIndication.created_at'
            )
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query->where('user.name', 'LIKE', '%' . $request['name'] . '%');
            })
            ->when(isset($request['dateStart']),
                function (Builder $query) use ($request) {
                    $query
                        ->where(
                            'userIndication.created_at', '>=',
                            Carbon::parse($request['dateStart'])->startOfDay());
                })
            ->when(isset($request['dateEnd']),
                function (Builder $query) use ($request) {
                    $query
                        ->where(
                            'userIndication.created_at', '<=',
                            Carbon::parse($request['dateEnd'])->endOfDay());
                })
            ->orderByDesc('userIndication.created_at')
            ->get();
    }

    public function findByWhoIndicatedIdAndIndicated(array $request)
    {
        return $this->getModel()
            ::where('userIndication.whoIndicatedId', $request['userId'])
            ->where('userIndication.statusId', StatusConst::ACTIVE)
            ->join('user as uWhoIndicated', 'userIndication.whoIndicatedId', '=', 'uWhoIndicated.idUser')
            ->join('levelAccess as levelAccessWhoIndicated', 'uWhoIndicated.idUser', '=', 'levelAccessWhoIndicated.userId')
            ->join('userType as userTypeWhoIndicated', 'levelAccessWhoIndicated.userTypeId', '=', 'userTypeWhoIndicated.idUserType')
            ->join('user as uIndicated', 'userIndication.userIndicatedId', '=', 'uIndicated.idUser')
            ->join('levelAccess as levelAccessIndicated', 'uIndicated.idUser', '=', 'levelAccessIndicated.userId')
            ->join('userType as userTypeIndicated', 'levelAccessIndicated.userTypeId', '=', 'userTypeIndicated.idUserType')
            ->joinSub(
                UserIndication::query()->where('statusId', StatusConst::ACTIVE)
                    ->select('whoIndicatedId',
                        DB::raw('count(whoIndicatedId) as quantityIndication'))
                    ->groupBy('whoIndicatedId'),
                'quantityIndication',
                function ($join) {
                    $join->on('userIndication.whoIndicatedId', '=', 'quantityIndication.whoIndicatedId');
                }
            )
            ->select(
                'userIndication.whoIndicatedId',
                'uWhoIndicated.name as whoIndicatedName',
                'userTypeWhoIndicated.name as whoIndicatedType',
                'quantityIndication.quantityIndication',
                'uIndicated.idUser as indicatedId',
                'uIndicated.name as indicatedName',
                'uIndicated.phone as indicatedPhone',
                'uIndicated.email as indicatedEmail',
                'uIndicated.quantityTrips',
                'userTypeIndicated.name as indicatedType',
                'userIndication.created_at'
            )
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query->where('user.name', 'LIKE', '%' . $request['name'] . '%');
            })
            ->when(isset($request['dateStart']),
                function (Builder $query) use ($request) {
                    $query
                        ->where(
                            'userIndication.created_at', '>=',
                            Carbon::parse($request['dateStart'])->startOfDay());
                })
            ->when(isset($request['dateEnd']),
                function (Builder $query) use ($request) {
                    $query
                        ->where(
                            'userIndication.created_at', '<=',
                            Carbon::parse($request['dateEnd'])->endOfDay());
                })
            ->orderByDesc('userIndication.created_at')
            ->get();
    }
}
