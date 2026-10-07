<?php


namespace Api\Services\Notification;


use Api\Repositories\Notification\CompanyDeliveryTokensRepository;
use App\Models\Notification\CompanyDeliveryTokens;

class CompanyNotificationService
{
    private $companyDeliveryTokensRepository;

    public function __construct(CompanyDeliveryTokensRepository $companyDeliveryTokensRepository)
    {
        $this->companyDeliveryTokensRepository = $companyDeliveryTokensRepository;
    }

    /**
     * @param array $request
     * @return CompanyDeliveryTokens
     * @throws \Exception
     */
    public function registerToken(array $request)
    {
        if($this->companyDeliveryTokensRepository->findTokenByCompany($request["token"], $request["companyId"]))
            return false;

        $companyDeliveryTokens = new CompanyDeliveryTokens($request);
        $this->companyDeliveryTokensRepository->save($companyDeliveryTokens);
        return $companyDeliveryTokens;
    }
}
