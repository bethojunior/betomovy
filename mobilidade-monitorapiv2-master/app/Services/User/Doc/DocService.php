<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/01/2020
 * Time: 13:23
 */

namespace App\Services\User\Doc;


use App\Constants\StatusConst;
use App\Models\User\Doc\Doc;
use App\Repositories\User\Doc\DocRepository;

class DocService
{
    /**
     * @var DocRepository
     */
    private $repository;

    public function __construct(DocRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function findAll()
    {
        return $this->repository
            ->findAll();
    }

    /**
     * @param array $request
     * @return Doc
     */
    public function insert(array $request)
    {
        $doc = new Doc($request);

        $this->repository
            ->save($doc);

        return $doc;
    }

    /**
     * @param $id
     * @param array $request
     * @return mixed
     */
    public function update($id, array $request)
    {
        $doc = $this->repository->find($id);

        $doc->fill($request);

        $this->repository->save($doc);

        return $doc;
    }

    /**
     * @param $id
     * @return bool
     */
    public function delete($id)
    {
        $doc = $this->repository->find($id);

        $doc->statusId = StatusConst::REMOVED;

        $this->repository->save($doc);

        return true;
    }
}
