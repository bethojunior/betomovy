<?php

namespace Delivery\Services\Delivery;

use Delivery\Repositories\Delivery\DeliverySectionRepository;

class DeliverySectionService
{
    private $repository;

    public function __construct(DeliverySectionRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->all();
    }
}
