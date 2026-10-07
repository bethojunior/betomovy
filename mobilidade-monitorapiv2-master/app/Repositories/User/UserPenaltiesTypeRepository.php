<?php


namespace App\Repositories\User;


use App\Contracts\Repository\AbstractRepository;
use App\Models\User\UserPenaltiesType;

class UserPenaltiesTypeRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(UserPenaltiesType::class);
    }
}
