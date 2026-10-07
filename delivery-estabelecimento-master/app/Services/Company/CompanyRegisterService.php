<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/06/2020
 * Time: 13:29
 */

namespace App\Services\Company;


use App\Constants\Company\CompanyRegisterStatusConst;
use App\Models\Balance\Balance;
use App\Models\Company\Company;
use App\Models\Company\CompanyWorker;
use App\Models\Customer;
use App\Models\User;

class CompanyRegisterService
{
    public function preRegister(array $request)
    {
        \DB::beginTransaction();

        try {
            $company = new Company($request);
            $company->name = $request['fantasyName'];
            $company->phone = onlyNumberAndLetters($request['user']['phone'] ?? '');
            $company->email = $request['user']['email'];

            $company->companyRegisterStatusId = CompanyRegisterStatusConst::PENDING;

            $balance = Balance::create();

            $company
                ->balance()
                ->associate($balance);

            $company->save();

            $this->createCompanyWorker($company, $request['user']);

            \DB::commit();
        } catch (\Throwable $e) {
            \DB::rollBack();
            throw $e;
        }

        return $company;
    }

    /**
     * @param Company $company
     * @param array $user
     * @return CompanyWorker
     */
    private function createCompanyWorker(Company $company, array $user): CompanyWorker
    {
        $user = new User($user);
        $user->save();

        $balance = Balance::create();

        $customer = new Customer;
        $customer->userId = $user->idUser;
        $customer->balanceId = $balance->idBalance;
        $customer->save();

        $companyWorker = new CompanyWorker;
        $companyWorker->companyId = $company->id;
        $companyWorker->userId = $user->idUser;
        $companyWorker->save();

        return $companyWorker;
    }
}
