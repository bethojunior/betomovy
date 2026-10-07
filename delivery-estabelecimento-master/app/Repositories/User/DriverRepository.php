<?php


namespace App\Repositories\User;


use App\Constants\StatusConst;
use App\Models\Driver;
use Common\Contracts\Repository\AbstractRepository;
use Illuminate\Database\Eloquent\Builder;

class DriverRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Driver::class);
    }

    public function findByEmail($email)
    {
        return $this->getModel()
            ::whereHas('user', function ($query) use ($email) {
                return $query
                    ->whereHas('userType', function (Builder $query) {
                        $query->where('isDeliveryMan', true);
                    })
                    ->where("email", $email);
            })->first();
    }

    public function findWithUser(int $driverId)
    {
        return $this->getModel()
            ::whereHas('user', function ($query) {
                return $query
                    ->whereHas('userType', function (Builder $query) {
                        $query->where('isDeliveryMan', true);
                    });
            })
            ->where('idDriver', $driverId)
            ->first();
    }
}
