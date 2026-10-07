<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/10/2019
 * Time: 09:43
 */

namespace App\Services\Company;


use App\Exceptions\Company\CompanyException;
use App\Models\Company\Company;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Company\CompanyRepository;

class CompanyVoucherService
{
    /**
     * @var CompanyRepository
     */
    private $companyRepository;
    /**
     * @var BalanceRepository
     */
    private $balanceRepository;

    public function __construct(CompanyRepository $companyRepository,
                                BalanceRepository $balanceRepository)
    {
        $this->companyRepository = $companyRepository;
        $this->balanceRepository = $balanceRepository;
    }

    /**
     * @param $request
     * @return CompanyRepository|CompanyRepository[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|null
     * @throws CompanyException
     */
    public function change($request)
    {
        /** @var Company $company */
        $company = $this->companyRepository
            ->find($request['companyId']);

        if ($company->voucherLimit && $request['value'] > $company->voucherLimit)
            throw new CompanyException('O valor solicitado não pode ser acima do limite permitido');

        $method = $request['action'];

        $this->balanceRepository
            ->$method(
                $company->balanceId,
                'tripBalance',
                $request['value']);

        return $this->companyRepository
            ->findFully($request['companyId']);
    }
}
