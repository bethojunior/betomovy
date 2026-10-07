<?php


namespace App\Services\Platform;


use App\Repositories\Platform\AppRepository;

class AppService
{
    /**
     * @var AppRepository
     */
    private $repository;

    public function __construct(AppRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository
            ->all();
    }
}