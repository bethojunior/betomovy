<?php

namespace App\Services\Config;

use App\Repositories\Config\IntegrationPartnersRepository;

class IntegrationPartnersService
{
    protected $repository;

    public function __construct(IntegrationPartnersRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->all();
    }

    public function create(array $attributes)
    {
        return $this->repository->create($attributes);
    }

    public function delete($id)
    {
        $model = $this->repository->find($id);
        if (!$model) {
            throw new \Exception('Parceiro de integração não encontrado');
        }

        return $this->repository->delete($model);
    }

    public function update($id, array $attributes)
    {
        
        $model = $this->repository->find($id);
        if (!$model) {
            throw new \Exception('Parceiro de integração não encontrado');
        }

        return $this->repository->updateIntegration($id, $attributes);
    }
}
