<?php


namespace Api\Repositories\Notification;


use App\Models\Notification\CompanyDeliveryTokens;
use Common\Contracts\Repository\AbstractRepository;

class CompanyDeliveryTokensRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CompanyDeliveryTokens::class);
    }

    public function findTokenByCompany($token, $companyId)
    {
        return $this->getModel()
            ::where("token", $token)
            ->where("companyId", $companyId)
            ->first();
    }
}
