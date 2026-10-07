<?php


namespace App\Repositories\Trip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripReport;
use Illuminate\Database\Eloquent\Builder;

class TripReportRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(TripReport::class);
    }

    public function findAll(array $request, int $cityId = null)
    {
        return TripReport::query()->join('user', 'tripReport.userId', 'user.idUser')
            ->join('levelAccess', 'user.idUser', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->leftJoin('tripReportType', 'tripReport.tripReportTypeId', 'tripReportType.idTripReportType')
            ->select(
                'tripReport.idTripReport',
                'tripReport.tripReference',
                'tripReport.message',
                'tripReport.userId',
                'tripReport.statusId',
                'tripReport.read',
                'tripReport.created_at',
                'tripReport.updated_at',
                'tripReportType.name as tripReportType',
                'user.name as nameUser',
                'user.phone as phoneName',
                'user.email as emailUser',
                'userType.name as userType'
            )
            ->when(isset($request['tripReference']), function (Builder $query) use ($request) {
                $query->where('tripReport.tripReference', $request['tripReference']);
            })
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->join('trip', 'tripReport.tripReference', 'trip.tripReference')
                ->where('trip.cityId', $cityId);
            })
            ->orderByDesc('tripReport.created_at')
            ->paginate($request['per_page'] ?? 10);
    }
}
