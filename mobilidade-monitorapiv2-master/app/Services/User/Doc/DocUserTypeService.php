<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/01/2020
 * Time: 15:52
 */

namespace App\Services\User\Doc;


use App\Constants\StatusConst;
use App\Models\User\Doc\DocUserType;
use App\Repositories\User\Doc\DocUserTypeRepository;

class DocUserTypeService
{
    /**
     * @var DocUserTypeRepository
     */
    private $repository;

    public function __construct(DocUserTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function allByUserType($userTypeId)
    {
        return $this->repository
            ->findByUserType($userTypeId);
    }

    public function insert($userTypeId, array $request)
    {
        $this->repository->deleteManyByUserType($userTypeId);

        $this->repository
            ->createMany(array_map(function ($arrayRequest) {
                $arrayRequest['created_at'] = now();
                $arrayRequest['updated_at'] = now();

                return $arrayRequest;
            }, $request));

        return true;
    }

    public function delete($id)
    {
        $docUserType = $this->repository
            ->find($id);

        $docUserType->statusId = StatusConst::REMOVED;

        $this->repository->save($docUserType);

        return true;
    }
}
