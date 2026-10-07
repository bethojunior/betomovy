<?php


namespace App\Services\RouteAudit;


use App\Models\RouteAudit\InternalAuditCategory;
use App\Repositories\RouteAudit\InternalAuditCategoryRepository;

class InternalAuditCategoryService
{
    private $repository;

    public function __construct(InternalAuditCategoryRepository $repository)
    {
        $this->repository = $repository;
    }


    public function findAll()
    {
        return InternalAuditCategory::all();
    }

    public function find(int $id)
    {
        return InternalAuditCategory::findOrFail($id);
    }

    public function save(array $data)
    {
        return InternalAuditCategory::create($data);
    }

    public function update(InternalAuditCategory $internalAuditCategory, array $data)
    {
        return $internalAuditCategory->update($data);
    }

    public function delete(int $id)
    {
        $internalAuditCategory = InternalAuditCategory::findOrFail($id);

        return $internalAuditCategory->delete();
    }

    public function findRequestsByCategory(int $id, array $request)
    {
        return $this->repository->findRequestsByCategory($id, $request);
    }
}
