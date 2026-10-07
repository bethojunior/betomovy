<?php

namespace App\Services\Audit;

use App\Constants\StatusConst;
use App\Http\Responses\ApiResponse;use App\Models\Audit\Audit;
use App\Repositories\Audit\AuditRepository;

class AuditService
{
    private $repository;

    /**
     * AuditService constructor.
     * @param $repository
     */
    public function __construct(AuditRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all(array $request= [])
    {
        return $this->repository->findAll($request);
    }

    public function store(array $request)
    {
        return Audit::create($request);
    }

    public  function delete($id)
    {
        $audit = $this->repository->find($id);
        $audit->statusId = StatusConst::REMOVED;

        return $audit->save();
    }
}
?>
