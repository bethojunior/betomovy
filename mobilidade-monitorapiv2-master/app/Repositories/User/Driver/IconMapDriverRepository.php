<?php


namespace App\Repositories\User\Driver;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver\IconMapDriver;
use App\Models\User\UserType;

class IconMapDriverRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(IconMapDriver::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()::where('statusId', StatusConst::ACTIVE)
            ->get();
    }

    public function isBoundToUserType(int $id): bool
    {
        return UserType::query()->where('iconMapDriverId', $id)->exists();
    }
}
