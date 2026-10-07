<?php


namespace App\Services\Route;


use App\Constants\StatusConst;
use App\Models\Route\CorporateRouteCustomer;
use App\Repositories\Route\CorporateRouteCustomerRepository;

class CorporateRouteCustomerService
{
    /**
     * @var CorporateRouteCustomerRepository
     */
    private $repository;

    public function __construct(CorporateRouteCustomerRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param array $request
     * @return CorporateRouteCustomer
     * @throws \Exception
     */
    public function insert(array $request)
    {
        $corporateRouteCustomer = new CorporateRouteCustomer($request);
        if ($this->repository->findCustomerByCompany($request["document"], $request["companyId"]))
            throw new \Exception("Cliente já cadastrado na empresa");
        $this->repository->save($corporateRouteCustomer);
        return $corporateRouteCustomer;
    }

    public function listByCompany($companyId)
    {
        return $this->repository->listByCompany($companyId);
    }

    public function delete($id)
    {
        $corporateRouteCustomer = $this->repository->find($id);
        $corporateRouteCustomer->statusId = StatusConst::REMOVED;
        $this->repository->save($corporateRouteCustomer);
        return $corporateRouteCustomer;
    }

    /**
     * @param $document
     * @param $companyId
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model|object|null
     * @throws \Exception
     */
    public function findCustomerByDocument($document, $companyId)
    {
        $corporateRouteCustomer = $this->repository->findCustomerByCompany($document, $companyId);
        if (!$corporateRouteCustomer)
            throw  new \Exception("Cliente não encontrado");
        return $corporateRouteCustomer;
    }
}
