<?php

namespace App\Services\Config;

use App\Models\Config\WebMapKey;
use App\Repositories\Config\WebMapKeyRepository;

class WebMapKeyService
{
    private $repository;

    public function __construct(WebMapKeyRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store(array $request)
    {
        $webMapKey = new WebMapKey($request);
        $webMapKey->save();
        return $webMapKey;
    }

    public function findAll()
    {
        return $this->repository->all();
    }

    public function delete($id)
    {
        $webMapKey = $this->repository->find($id);
        $webMapKey->delete();
    }
}
