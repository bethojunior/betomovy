<?php


namespace App\Services\User;


use App\Repositories\User\PartnerRepository;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;

class PartnerService
{
    private $repository;

    public function __construct(PartnerRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request, int $cityId = null): Paginator
    {
        return $this->repository->findAll($request, Auth::user(), $cityId);
    }
}
