<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/10/2019
 * Time: 13:48
 */

namespace App\Services\Company;


use App\Repositories\Company\CompanyRegisterStatusRepository;

class CompanyRegisterStatusService
{
    /**
     * @var CompanyRegisterStatusRepository
     */
    private $repository;

    public function __construct(CompanyRegisterStatusRepository $repository)
    {

        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository
            ->all();
    }
}
