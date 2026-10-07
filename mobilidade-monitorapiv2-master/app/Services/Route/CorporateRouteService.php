<?php


namespace App\Services\Route;


use App\Constants\StatusConst;
use App\Models\Route\CorporateRoute;
use App\Repositories\Route\CorporateRouteRepository;

class CorporateRouteService
{
    /**
     * @var CorporateRouteRepository
     */
    private $repository;

    public function __construct(CorporateRouteRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param array $request
     * @return CorporateRoute
     * @throws \Exception
     */
    public function insert(array $request)
    {
        $corporateRoute = new CorporateRoute($request);
        if ($this->repository->findCompanyByCorporateRoute($corporateRoute->companyId, $corporateRoute->routeId))
            throw new \Exception("Empresa já cadastrada na rota");
        $this->repository->save($corporateRoute);
        return $corporateRoute;
    }

    public function all()
    {
        return $this->repository->findAll();
    }

    public function delete($id)
    {
        /**
         * @var CorporateRoute $corporateRoute
         */
        $corporateRoute = $this->repository->find($id);

        $corporateRoute->statusId = StatusConst::REMOVED;

        $this->repository->save($corporateRoute);

        return $corporateRoute;
    }

    public function update($id, array $request)
    {
        /**
         * @var CorporateRoute $corporateRoute
         */
        $corporateRoute = $this->repository->find($id);

        $corporateRoute->routeId = $request['routeId'];
        $corporateRoute->companyId = $request['companyId'];

        $this->repository->save($corporateRoute);

        return $corporateRoute;
    }

    public function getCompaniesByRoute($routeId)
    {
        return $this->repository->findCompaniesByRoute($routeId);
    }

    public function findRouteByCompany($companyId)
    {
        return $this->repository->findRouteByCompany($companyId);
    }
}
