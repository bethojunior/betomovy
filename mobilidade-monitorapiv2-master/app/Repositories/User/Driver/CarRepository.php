<?php


namespace App\Repositories\User\Driver;

use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver\Car;
use Illuminate\Database\Eloquent\Builder;

class CarRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(Car::class);
    }

    public function getPendingCars($cityId)
    {
        return $this->getModel()::query()
            ->join('driver', 'car.driverId', '=', 'driver.idDriver')
            ->join('user', 'driver.userId', '=', 'user.idUser')
            ->select(
                'car.*',
                'driver.idDriver',
                'user.idUser',
                'user.name as driverName',
                'user.cityId'
            )
            ->where('car.pending', '=', '1')
            ->when(isset($cityId), function (Builder $query) use ($cityId){
                $query
                    ->where('user.cityId', '=', $cityId);
            })
            ->paginate();
    }
}
