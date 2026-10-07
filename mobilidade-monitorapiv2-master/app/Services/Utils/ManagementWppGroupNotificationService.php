<?php


namespace App\Services\Utils;


use App\Repositories\Utils\ManagementWppGroupNotificationRepository;

class ManagementWppGroupNotificationService
{
    private $repository;

    public function __construct(ManagementWppGroupNotificationRepository $repository)
    {
        $this->repository = $repository;
    }


    public function findAll(?string $reference = null)
    {
        return $this->repository->findAll($reference);
    }

    public function find(int $id)
    {
        return $this->repository->findOrFail($id);
    }


    public function store(array $data)
    {
        return $this->repository->create($data);
    }


    public function update(int $id, array $data)
    {
        $record = $this->repository->findOrFail($id);
        $this->repository->update($record, $data);

        return $record;
    }


    public function delete(int $id)
    {
        $record = $this->repository->findOrFail($id);
        $this->repository->delete($record);

        return $record;
    }
}
