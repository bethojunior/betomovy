<?php


namespace Delivery\Repositories\Company;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Company\CompanyDeliveryTokens;

class CompanyDeliveryTokensRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(CompanyDeliveryTokens::class);
    }

    /**
     * @param $companyId
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function findTokensByCompany($companyId)
    {
        return $this->getModel()
            ::where("companyId",$companyId)
            ->where("token", "like","%ExponentPushToken%")
            ->limit(10)
            ->orderBy("id","DESC")
            ->get();
    }

}
