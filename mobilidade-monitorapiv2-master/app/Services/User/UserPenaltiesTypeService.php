<?php


namespace App\Services\User;


use App\Models\User\UserPenaltiesType;
use App\Repositories\User\UserPenaltiesTypeRepository;

class UserPenaltiesTypeService
{
    private $repository;

    public function __construct(UserPenaltiesTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->all();
    }

    public function update(UserPenaltiesType $userPenaltiesType, array $request)
    {
        $userPenaltiesType->valueRating = $request['value'];
        $userPenaltiesType->save();

        return $userPenaltiesType;
    }
}
