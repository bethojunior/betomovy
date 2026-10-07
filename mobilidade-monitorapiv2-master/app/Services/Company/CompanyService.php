<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/10/2019
 * Time: 14:31
 */

namespace App\Services\Company;


use App\Constants\Company\CompanyRegisterConst;
use App\Constants\StatusConst;
use App\Exceptions\Company\CompanyException;
use App\Models\Balance\Balance;
use App\Models\Company\Company;
use App\Models\Company\CompanyWorker;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Company\CompanyRepository;
use App\Repositories\Company\CompanyWorkerRepository;
use App\Repositories\Locale\CityRepository;
use App\Repositories\User\UserRepository;
use App\Utils\Admin704Apps\Admin704Apps;
use Illuminate\Support\Facades\Auth;

class CompanyService
{
    /**
     * @var CompanyRepository
     */
    private $repository;
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var CompanyWorkerRepository
     */
    private $companyWorkerRepository;
    /**
     * @var BalanceRepository
     */
    private $balanceRepository;
    /**
     * @var
     */
    private $model;

    private $cityRepository;

    private $admin704Apps;

    public function __construct(CompanyRepository $repository,
                                UserRepository $userRepository,
                                CompanyWorkerRepository $companyWorkerRepository,
                                BalanceRepository $balanceRepository,
                                CityRepository $cityRepository,
                                Admin704Apps $admin704Apps,
                                Company $company)
    {
        $this->repository = $repository;
        $this->userRepository = $userRepository;
        $this->companyWorkerRepository = $companyWorkerRepository;
        $this->balanceRepository = $balanceRepository;
        $this->cityRepository = $cityRepository;
        $this->admin704Apps = $admin704Apps;
        $this->model = $company;
    }

    /**
     * @param array $params
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|null
     * @throws \Exception
     */

    public function edit(array $params)
    {
        try{
            $company = $this->repository->find($params['id']);

            if (!$company)
                throw new \Exception("Usuário não encontrado");

            $company->fill($params);

            $this->repository->save($company);

        }catch (\Exception $exception){
            throw $exception;
        }

        return $company;
    }

    /**
     * @param $id
     * @return CompanyRepository|CompanyRepository[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|null
     * @throws CompanyException
     */
    public function find($id)
    {
        $company = $this->repository
            ->findFully($id);

        if (!$company)
            throw new CompanyException("Pessoa jurídica não encontrada");

        $company->manager = $this->companyWorkerRepository
            ->findByCompany($id, true);

        return $company;
    }

    public function findAll(array $request = [], $cityId = null)
    {
        return $this->repository
            ->findAll(Auth::user(), $request, $cityId);
    }

    /**
     * @param array $request
     * @return Company
     * @throws \Exception
     */
    public function insert(array $request)
    {
        // Busca a cidade no banco de dados do admin704apps
//        $findCityDbAdmin = $this->admin704Apps->getCityById($request['cityId']);

        // Busca a cidade no banco de dados do cliente
//        $findCityIdInLocale = $this->cityRepository->all($findCityDbAdmin->name, $findCityDbAdmin->estate_id);

//        $request['cityId'] = $findCityIdInLocale[0]->id;
        try {
            \DB::beginTransaction();

            $company = new Company($request);
            $company->companyRegisterStatusId = CompanyRegisterConst::ACTIVE;

            $this->repository
                ->save($company);

            if (isset($request['userId'])) {
                $companyWorker = new CompanyWorker;
                $companyWorker->userId = $request['userId'];
                $companyWorker->companyId = $company->id;
                $companyWorker->isManager = true;

                $this->companyWorkerRepository
                    ->save($companyWorker);
            }

            if (isset($request['workers']))
                $this->createWorkers($request['workers'], $company);

            /** @var Balance $balance */
            $balance = $this->balanceRepository
                ->create();

            $company->balance()
                ->associate($balance);

            $this->repository
                ->save($company);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        return $company;
    }

    private function createWorkers(array $workers, Company $company)
    {
        foreach ($workers as $worker) {
            $companyWorker = new CompanyWorker;
            $companyWorker->userId = $worker['userId'];
            $companyWorker->companyId = $company->id;

            $this->companyWorkerRepository
                ->save($companyWorker);
        }
    }

    public function workers($id)
    {
        return $this->companyWorkerRepository
            ->findByCompany($id);
    }

    public function delete($id)
    {
        /** @var Company $company */
        $company = $this->repository
            ->find($id);

        $company
            ->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($company);

        return true;
    }

    public function enable($id)
    {
        /** @var Company $company */
        $company = $this->repository
            ->find($id);

        $company
            ->companyRegisterStatusId = CompanyRegisterConst::ACTIVE;

        $this->repository
            ->save($company);

        return $company;
    }

    public function block($id)
    {
        /** @var Company $company */
        $company = $this->repository
            ->find($id);

        $company
            ->companyRegisterStatusId = CompanyRegisterConst::BLOCKED;

        $this->repository
            ->save($company);

        return $company;
    }

    public function setEstablishmentCollectionManagement(int $id, int $establishmentCollectionManagementId)
    {
        $company = Company::find($id);
        $company->establishmentCollectionManagementId = $establishmentCollectionManagementId;
        $company->save();

        return $company;
    }
}
