<?php


namespace App\Repositories\Trip;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripRating;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class TripRatingRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(TripRating::class);
    }

    public function findAll(array $request = [], int $cityId = null, bool $isSupport = false)
    {
        return $this->getModel()::query()->join('driver', 'tripRating.ratedUser', 'driver.userId')
            ->join('user as ratedUser', 'driver.userId', 'ratedUser.idUser')
            ->join('user as userWhoEvaluated', 'tripRating.userWhoEvaluated', 'userWhoEvaluated.idUser')
            ->select(
                'tripRating.tripReference',
                'driver.idDriver',
                'ratedUser.name as driverName',
                'userWhoEvaluated.idUser as idUser',
                'userWhoEvaluated.name as userName',
                'tripRating.rating',
                'tripRating.created_at',
                'tripRating.comment'
            )
            ->where('tripRating.statusId', StatusConst::ACTIVE)
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query->where('userWhoEvaluated.idUser', $request['userId']);
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('tripRating.created_at', '>', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('tripRating.created_at', '<', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(!$isSupport && isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('driver.cityId', $cityId);
            })
            ->orderByDesc('tripRating.created_at')
            ->paginate($request['per_page'] ?? 20);
    }

    public function deleteDriversRating(int $id = null, int $cityId = null): bool
    {
        return (bool)$this->getModel()::join('driver', 'driver.userId', 'tripRating.ratedUser')
            ->when(isset($id), function (Builder $query) use ($id) {
                $query->where('driver.idDriver', $id);
            })
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('driver.cityId', $cityId);
            })
            ->update(['tripRating.statusId' => StatusConst::REMOVED]);
    }
}
