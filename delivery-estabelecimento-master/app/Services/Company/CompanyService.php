<?php

namespace App\Services\Company;

use App\Repositories\Company\CompanyDeliveryConfigRepository;
use App\Repositories\Company\CompanyRepository;
use App\Repositories\User\UserRepository;

class CompanyService
{
    private $companyRepository;
    private $userRepository;
    private $companyDeliveryConfigRepository;

    public function __construct(
        CompanyRepository               $companyRepository,
        UserRepository                  $userRepository,
        CompanyDeliveryConfigRepository $companyDeliveryConfigRepository
    )
    {
        $this->companyRepository = $companyRepository;
        $this->userRepository = $userRepository;
        $this->companyDeliveryConfigRepository = $companyDeliveryConfigRepository;
    }

    public function update(array $request)
    {
        $user = $this->userRepository->find(\Auth::user()->idUser);

        if ($user->email != $request['email']) {
            if ($this->userRepository->findByEmail($request['email']))
                throw new \Exception("E-mail já esta sendo utilizado");

            $user->email = $request['email'];
            $user->save();
        }
        $company = $this->companyRepository->find(\Auth::user()->companyWorker->companyId);

        $company->fantasyName = $request['name'];
        $company->email = $request['email'];

        $company->save();

        if (isset($request['picture'])) {
            $companyDeliveryConfig = $this->companyDeliveryConfigRepository->findByCompany($company->id);

            $pictureName = \Storage::cloud()
                ->putFile(
                    'company/' . $company->id . '/delivery/logo',
                    $request['picture']);

            $companyDeliveryConfig->picture = $pictureName;
            $companyDeliveryConfig->save();
        }

    }
}
