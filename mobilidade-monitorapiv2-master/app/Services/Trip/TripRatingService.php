<?php


namespace App\Services\Trip;


use App\Repositories\Trip\TripRatingRepository;
use Illuminate\Support\Facades\Auth;

class TripRatingService
{
    private $repository;

    public function __construct(TripRatingRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request = [], int $cityId = null)
    {
        return $this->repository->findAll($request, $cityId, (bool)(Auth::user())->role->support);
    }
}
