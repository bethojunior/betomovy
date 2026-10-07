<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/06/2020
 * Time: 13:29
 */

namespace App\Services\Company;


use App\Constants\Company\CompanyRegisterStatusConst;
use App\Constants\Users\UserTypeConst;
use App\Models\Balance\Balance;
use App\Models\Company\Company;
use App\Models\Company\CompanyWorker;
use App\Models\User;
use App\Models\User\LevelAccess;
use Illuminate\Support\Facades\DB;

class CompanyRegisterService
{
    public function preRegister(array $request)
    {
        DB::beginTransaction();

        try {
            $company = new Company($request);
            $company->name = $request['fantasyName'];
            $company->phone = onlyCharacters($request['user']['phone'] ?? '');
            $company->email = $request['user']['email'];

            $company->companyRegisterStatusId = CompanyRegisterStatusConst::PENDING;

            $balance = Balance::create();

            $company
                ->balance()
                ->associate($balance);

            $company->save();

            $this->createCompanyWorker($company, $request['user']);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
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
        $user = new User\User($user);
        $user->password = base64_encode($user['password']);
        $user->save();

        $balance = Balance::create();

        $levelAccess = new LevelAccess;
        $levelAccess->userTypeId = UserTypeConst::CUSTOMER;
        $levelAccess->userId = $user->idUser;
        $levelAccess->save();

        $customer = new User\Customer();
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
